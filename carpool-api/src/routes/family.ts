import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

/* interface PersonData {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  seats?: number;
  email?: string;
  phone?: string;
  boosterSeat?: boolean;
  frontSeat?: boolean;
}

interface FamilyData {
  email: string;
  password: string;
  phone?: string;
  parents: PersonData[];
  children: PersonData[];
} */

router
  .route('/')
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      /* const families = await prisma.family.findMany({
        include: {
          parents: {
            include: {
              person: true,
            },
          },
          children: {
            include: {
              person: true,
            },
          },
        },
      }); */
      res.send(families);
    } catch (err) {
      next(err);
    }
  })
  .post(async (req: Request, res: Response, next: NextFunction) => {
    try {
      /*  const { email, password, phone, parents, children }: FamilyData =
        req.body;
      const family = await prisma.family.create({
        data: {
          email,
          password,
          phone,
        },
      });
      const createPersonAndProfile = async (
        people: PersonData[],
        type: 'parent' | 'child',
      ) => {
        return await Promise.all(
          people.map(async (person) => {
            const {
              name,
              street,
              city,
              state,
              zip,
              seats,
              boosterSeat,
              frontSeat,
              phone,
              email,
            } = person;
            const address = await prisma.address.create({
              data: {
                street,
                city,
                state,
                zip,
              },
            });
            const personRecord = await prisma.person.create({
              data: {
                name,
                addressId: address.id,
              },
            });
            if (type === 'parent') {
              return await prisma.parent.create({
                data: {
                  personId: personRecord.id,
                  familyId: family.id,
                  seats: seats || 0,
                  email: email || '',
                  phone: phone || '',
                },
              });
            } else {
              return await prisma.child.create({
                data: {
                  personId: personRecord.id,
                  familyId: family.id,
                  boosterSeat: boosterSeat || false,
                  frontSeat: frontSeat || false,
                },
              });
            }
          }),
        );
      };
      const parentRecords = await createPersonAndProfile(parents, 'parent');
      const childRecords = await createPersonAndProfile(children, 'child'); */
      res
        .status(201)
        .json({ family, parents: parentRecords, children: childRecords });
    } catch (err) {
      next(err);
    }
  });

export default router;
