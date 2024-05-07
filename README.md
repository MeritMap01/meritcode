# start

create a new .env file, then add the contents from .env.example

```sh
pnpm install
```

```sh
docker compose -f tools/compose/development.yml --env-file .env -p reactive-resume up -d
```

```sh
pnpm dev
```

# Start creating a new resume

- Create a new template tsx file (ex, sampleTemplate.tsx) using anyone of the existing templates in this folder
apps/artboard/src/templates

- Create a new template json file using anyone of the existing json files in this folder apps/client/public/templates/json

- Import your templates to apps/artboard/src/templates/index.tsx, follow the same nomencalture

- Add the name of the template to list of resume template names.

- Add the image of the resume to apps/client/public/templates/jpg

- Then start editing the new template and verify the rendered template in localhost