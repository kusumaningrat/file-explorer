
import cors from "@elysiajs/cors";
import { PrismaClient } from "@prisma/client";
import { Elysia } from "elysia";

const prisma = new PrismaClient();
const app = new Elysia()

app.use(cors());

// ✅ Create Folder
app.post("/folders", async ({ body }) => {
  const { name, parentId } = body as { name: string; parentId?: number };
  let parentPath = "";
  if (parentId) {
    const parent = await prisma.folder.findUnique({ where: { id: parentId } });
    if (!parent) throw new Error("Parent folder not found");
    parentPath = parent.path.replace(/\/+$/, ''); 
  }

  const slug = name.toLowerCase().replace(/\s+/g, "-");


  return prisma.folder.create({
    data: {
      name,
      parentId: parentId ?? null,
      slug,
      path: parentPath ? `${parentPath}/${slug}` : `/${slug}`,
    }
  });
});

// ✅ Get Root Folders
app.get("/folders", async () => {
  return prisma.folder.findMany({
    where: { parentId: null }
  });
});

// ✅ Get Children of a Folder
app.get("/folders/:id/children", async ({ params }) => {
  return prisma.folder.findMany({
    where: { parentId: Number(params.id) }
  });
});

// ✅ Get Full Tree (recursive)
app.get("/folders/:id/tree", async ({ params }) => {
  async function buildTree(id: number): Promise<(typeof folder & { children: any[] }) | null> {
    const folder = await prisma.folder.findUnique({
      where: { id },
      include: { children: true }
    });
    if (!folder) return null;

    const children = (await Promise.all(
      folder.children.map(child => buildTree(child.id))
    )).filter(child => child !== null);
    return { ...folder, children };
  }

  return buildTree(Number(params.id));
});

// ✅ Update Folder (rename / move)
app.put("/folders/:id", async ({ params, body }) => {
  const { name, parentId } = body as { name?: string; parentId?: number };
  return prisma.folder.update({
    where: { id: Number(params.id) },
    data: {
      ...(name ? { name } : {}),
      ...(parentId !== undefined ? { parentId } : {})
    }
  });
});

// ✅ Delete Folder (subfolders auto-deleted by cascade)
app.delete("/folders/:id", async ({ params }) => {
  return prisma.folder.delete({
    where: { id: Number(params.id) }
  });
});

app.listen(3000);


console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
