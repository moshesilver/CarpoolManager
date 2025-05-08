import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
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

router
  .route('/')
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

export default router;
