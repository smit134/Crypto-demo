import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const dataPath = path.join(__dirname, '../../data/vasps.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const vasps = JSON.parse(rawData);

  console.log(`Starting to seed ${vasps.length} VASPs...`);

  for (const vasp of vasps) {
    // Upsert the VASP
    const createdVasp = await prisma.vasp.upsert({
      where: { name: vasp.name },
      update: { description: vasp.description },
      create: {
        name: vasp.name,
        description: vasp.description,
      },
    });

    console.log(`✅ Upserted VASP: ${createdVasp.name}`);

    // Process Addresses
    for (const addr of vasp.addresses) {
      // 1. Ensure the core address exists in the Address table
      await prisma.address.upsert({
        where: { address: addr.address },
        update: {},
        create: {
          address: addr.address,
        },
      });

      // Fetch the internal Address ID
      const dbAddress = await prisma.address.findUnique({
        where: { address: addr.address }
      });

      if (!dbAddress) continue;

      // 2. Link the Address to the VASP in the VaspAddress table
      // We check if this exact link already exists (requires finding first since there's no unique composite key in prisma schema for this yet)
      const existingLink = await prisma.vaspAddress.findFirst({
        where: {
          vaspId: createdVasp.id,
          addressId: dbAddress.id,
        }
      });

      if (!existingLink) {
        await prisma.vaspAddress.create({
          data: {
            vaspId: createdVasp.id,
            addressId: dbAddress.id,
            source: addr.source,
            sourceReference: addr.sourceReference,
            confidence: addr.confidence,
            lastVerified: new Date(addr.lastVerified),
          }
        });
        console.log(`  -> Linked address ${addr.address}`);
      }
    }
  }

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
