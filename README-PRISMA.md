# Prisma Commands

## Database Commands

### Pull database schema
```bash
npx prisma db pull --schema=src/prisma/schema.prisma
```

### Generate Prisma Client
```bash
npx prisma generate --schema=src/prisma/schema.prisma
```

### Push schema to database
```bash
npx prisma db push --schema=src/prisma/schema.prisma
```

### Reset database
```bash
npx prisma db reset --schema=src/prisma/schema.prisma
```

### Migrate database
```bash
npx prisma migrate dev --schema=src/prisma/schema.prisma
```

### Deploy migrations
```bash
npx prisma migrate deploy --schema=src/prisma/schema.prisma
```

## Studio Commands

### Open Prisma Studio
```bash
npx prisma studio --schema=src/prisma/schema.prisma
```

## Validation Commands

### Validate schema
```bash
npx prisma validate --schema=src/prisma/schema.prisma
```

### Format schema
```bash
npx prisma format --schema=src/prisma/schema.prisma
```

## Environment Setup

### If using .env.local instead of .env
```bash
# Option 1: Use dotenv-cli
npm install -g dotenv-cli
dotenv -e .env.local -- npx prisma db pull --schema=src/prisma/schema.prisma

# Option 2: Copy DATABASE_URL to .env file
echo 'NEXT_DATABASE_URL="your_database_url_here"' > .env
```

## Common Workflows

### Initial setup
```bash
# 1. Pull existing database schema
npx prisma db pull --schema=src/prisma/schema.prisma

# 2. Generate client
npx prisma generate --schema=src/prisma/schema.prisma
```

### After schema changes
```bash
# 1. Format schema
npx prisma format --schema=src/prisma/schema.prisma

# 2. Validate schema
npx prisma validate --schema=src/prisma/schema.prisma

# 3. Push to database
npx prisma db push --schema=src/prisma/schema.prisma

# 4. Generate client
npx prisma generate --schema=src/prisma/schema.prisma
```

### Development workflow
```bash
# 1. Create migration
npx prisma migrate dev --name "your_migration_name" --schema=src/prisma/schema.prisma

# 2. Generate client
npx prisma generate --schema=src/prisma/schema.prisma
```

## Package.json Scripts

Add these to your package.json for easier usage:

```json
{
  "scripts": {
    "db:pull": "npx prisma db pull --schema=src/prisma/schema.prisma",
    "db:push": "npx prisma db push --schema=src/prisma/schema.prisma",
    "db:generate": "npx prisma generate --schema=src/prisma/schema.prisma",
    "db:studio": "npx prisma studio --schema=src/prisma/schema.prisma",
    "db:migrate": "npx prisma migrate dev --schema=src/prisma/schema.prisma",
    "db:reset": "npx prisma db reset --schema=src/prisma/schema.prisma",
    "db:validate": "npx prisma validate --schema=src/prisma/schema.prisma",
    "db:format": "npx prisma format --schema=src/prisma/schema.prisma"
  }
}
```

Then you can use:
```bash
npm run db:pull
npm run db:generate
npm run db:studio
# etc...
```
