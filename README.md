## meritApp: Build Your Resume

**meritApp** is a powerful resume builder designed to help you create professional and impactful resumes.  

### Getting Started

Follow these steps to set up the meritApp development environment locally:

**Prerequisites:**

- Docker (with Docker Compose)
- Node.js 18 or higher (with pnpm)

**1. Clone the Repository**

```bash
git clone https://github.com/meritApp/meritApp.git
cd meritApp
```

**2. Install Dependencies**

```bash
pnpm install
```

**3. Configure Environment Variables**

```bash
cp .env.example .env
```

Review the environment variables in `.env` and adjust them as needed (e.g., port numbers).

**4. Start Services with Docker Compose**

```bash
docker compose -f tools/compose/development.yml --env-file .env -p meritApp up -d
```

This command will launch all necessary services. You can check their status with:

```bash
docker compose -p meritApp ps
```

**5. Run the Development Server**

```bash
pnpm prisma:migrate:dev
pnpm dev
```

The frontend should be accessible at `http://localhost:5173`, and the backend API at `http://localhost:3000`.

### Contributing New Resume Templates

Want to help expand meritApp's library of resume templates? Follow these steps:

**1. Create New Template Files**

- **Template TSX:** Create a new `*.tsx` file in `apps/artboard/src/templates` using an existing template as a guide.
- **Template JSON:** Create a new JSON file in `apps/client/public/templates/json` based on an existing JSON file.
- **Template Image:** Add a corresponding image file (e.g., `.jpg`) for your template in `apps/client/public/templates/jpg`.

**2. Import Template**

- Update `apps/artboard/src/templates/index.tsx` to import your newly created template.
- Add the name of your template to the list of resume template names.

**3. Verify and Test**

- Access `http://localhost:5173` and select your newly added template to view and test it.
- Make any necessary adjustments to ensure your template functions correctly.


