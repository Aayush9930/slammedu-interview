"use server";

import { db, posts, user } from "@/db";
import { desc, lt, eq, and } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const PAGE_SIZE = 5;

// ... existing getPosts ...

export async function getMyPosts(cursor?: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error("Unauthorized");
    }
    // ...
    // (Wait, I should insert it BEFORE getMyPosts or create a new block)
    // I'll prepend it to the file's export list or place it after createPost.
    // Let's place it BEFORE getMyPosts for valid replace.


    const data = await db
        .select({
            id: posts.id,
            imageUrl: posts.imageUrl,
            caption: posts.caption,
            createdAt: posts.createdAt,
            user: {
                name: user.name,
                image: user.image,
            },
        })
        .from(posts)
        .innerJoin(user, eq(posts.userId, user.id))
        .where(
            and(
                eq(posts.userId, session.session.userId),
                cursor ? lt(posts.createdAt, new Date(cursor)) : undefined
            )
        )
        .orderBy(desc(posts.createdAt))
        .limit(PAGE_SIZE);

    const nextCursor =
        data.length === PAGE_SIZE
            ? data[data.length - 1].createdAt.toISOString()
            : null;

    return {
        posts: data,
        nextCursor,
    };
}

export async function createPost(formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    const file = formData.get("file") as File;
    const caption = formData.get("caption") as string;

    if (!file) {
        throw new Error("No file uploaded");
    }

    // Upload image
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    const response = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        body: uploadFormData,
    });

    if (!response.ok) {
        throw new Error("Failed to upload image");
    }

    const { url } = (await response.json()) as { url: string };

    // Create post
    await db.insert(posts).values({
        id: crypto.randomUUID(),
        userId: session.session.userId,
        imageUrl: url,
        caption,
    });

    return { success: true };
}

export async function getPosts(cursor?: string) {
    const data = await db
        .select({
            id: posts.id,
            imageUrl: posts.imageUrl,
            caption: posts.caption,
            createdAt: posts.createdAt,
            user: {
                name: user.name,
                image: user.image,
            },
        })
        .from(posts)
        .innerJoin(user, eq(posts.userId, user.id))
        .where(cursor ? lt(posts.createdAt, new Date(cursor)) : undefined)
        .orderBy(desc(posts.createdAt))
        .limit(PAGE_SIZE);

    const nextCursor =
        data.length === PAGE_SIZE
            ? data[data.length - 1].createdAt.toISOString()
            : null;

    return {
        posts: data,
        nextCursor,
    };
}

export async function updateProfile(formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    const name = formData.get("name") as string;
    const file = formData.get("file") as File;

    let imageUrl = session.user.image;

    if (file && file.size > 0) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);

        const response = await fetch("http://localhost:3000/api/upload", {
            method: "POST",
            body: uploadFormData,
        });

        if (!response.ok) {
            throw new Error("Failed to upload image");
        }
        const data = (await response.json()) as { url: string };
        imageUrl = data.url;
    }

    await db
        .update(user)
        .set({
            name,
            image: imageUrl,
        })
        .where(eq(user.id, session.session.userId));

    return { success: true };
}
