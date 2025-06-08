import express, { Request, Response, NextFunction } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import { getAuth } from '@clerk/express';

const router = express.Router();
const prisma = new PrismaClient();

interface AddressInput {
  street: string;
  city: string;
  state: string;
  zip: string;
}

interface ParentInput {
  name: string;
  email: string;
  phone: string;
  seats: number;
  address: AddressInput;
}

interface ChildInput {
  name: string;
  boosterSeat: boolean;
  frontSeat: boolean;
  address: AddressInput;
}

interface FamilyInput {
  parents: ParentInput[];
  children: ChildInput[];
}

interface SameAsAddress {
  sameAsId: string;
  street?: never;
  city?: never;
  state?: never;
  zip?: never;
}

interface FullAddress {
  sameAsId?: never;
  street: string;
  city: string;
  state: string;
  zip: string;
}

type UpdateAddressBody = SameAsAddress | FullAddress;

// all family requests are mounted on / instead of /:id to prevent access to families by id
router
  .route('/')
  // returns user family
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = getAuth(req);
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const family = await prisma.family.findUnique({
        where: {
          clerkUserId: userId
        },
        include: {
          parents: { include: { person: { include: { address: true } } } },
          children: { include: { person: { include: { address: true } } } }
        }
      });

      if (!family) {
        res.status(404).json({ error: 'Family not found' });
        return;
      }

      res.json(family);
    } catch (err) {
      next(err);
    }
  })
  // creates user family
  .post(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = getAuth(req);
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { parents, children } = req.body as FamilyInput;
    if (parents.length < 1) {
      res.status(400).json({
        error: 'At least one parent is required'
      });
      return;
    }

    try {
      const family = await prisma.family.create({
        data: {
          clerkUserId: userId,
          parents: {
            create: parents.map((p) => ({
              email: p.email,
              phone: p.phone,
              seats: p.seats,
              person: {
                create: {
                  name: p.name,
                  address: {
                    connectOrCreate: {
                      where: {
                        street_city_state_zip: {
                          street: p.address.street,
                          city: p.address.city,
                          state: p.address.state,
                          zip: p.address.zip
                        }
                      },
                      create: p.address
                    }
                  }
                }
              }
            }))
          },
          children: {
            create: children.map((c) => ({
              boosterSeat: c.boosterSeat,
              frontSeat: c.frontSeat,
              person: {
                create: {
                  name: c.name,
                  address: {
                    connectOrCreate: {
                      where: {
                        street_city_state_zip: {
                          street: c.address.street,
                          city: c.address.city,
                          state: c.address.state,
                          zip: c.address.zip
                        }
                      },
                      create: c.address
                    }
                  }
                }
              }
            }))
          }
        },
        include: {
          parents: { include: { person: { include: { address: true } } } },
          children: { include: { person: { include: { address: true } } } }
        }
      });
      res.status(201).json(family);
    } catch (err) {
      next(err);
    }
  });

router
  .route('/:personId/address')
  //edits persons address
  .patch(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = getAuth(req);
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const personId = Number(req.params.personId);
      const body = req.body as UpdateAddressBody;

      // Ensure the person belongs to this user’s family
      const person = await prisma.person.findUnique({
        where: { id: personId },
        include: {
          parent: { include: { family: true } },
          child: { include: { family: true } }
        }
      });
      if (!person) {
        res.status(404).json({ error: 'Person not found' });
        return;
      }

      const clerkUserId =
        person.parent?.family.clerkUserId ?? person.child?.family.clerkUserId;
      if (clerkUserId !== userId) {
        res.status(403).json({ error: 'Forbidden' });
        return;
      }

      // If sameAsId, just reassign
      if (body.sameAsId !== null && body.sameAsId !== '') {
        const sameAsId = Number(body.sameAsId);
        if (isNaN(sameAsId)) {
          res.status(400).json({ error: 'sameAsId must be a number' });
          return;
        }
        await prisma.person.update({
          where: { id: personId },
          data: { addressId: sameAsId }
        });
        res.json({ success: true });
        return;
      }

      const { street, city, state, zip } = body;
      if (!(street && city && state && zip)) {
        res.status(400).json({ error: 'Incomplete address' });
        return;
      }

      await prisma.person.update({
        where: {
          id: personId
        },
        data: {
          address: {
            connectOrCreate: {
              where: {
                street_city_state_zip: { street, city, state, zip }
              },
              create: { street, city, state, zip }
            }
          }
        }
      });

      res.json({ success: true });
      return;
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(400).json({ error: err.message });
        return;
      }
      next(err);
    }
  });

/* router
  .route('/address/:addressId')
  .get(async (req, res, next) => {
    try {
      const { userId } = getAuth(req);
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const aid = Number(req.params.addressId);
      const addr = await prisma.address.findUnique({ where: { id: aid } });
      if (!addr) {
        res.status(404).json({ error: 'Not found' });
        return;
      }
      res.json(addr);
    } catch (err) {
      next(err);
    }
  })
  .patch(async (req, res, next) => {
    try {
      const { userId } = getAuth(req);
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const aid = Number(req.params.addressId);
      const body = req.body as AddressInput;
      const updated = await prisma.address.update({
        where: { id: aid },
        data: {
          street: body.street,
          city: body.city,
          state: body.state,
          zip: body.zip
        }
      });
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }); */

export default router;
