"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import { createPost } from "@/app/app/actions";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function CreatePostModal() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();
    const router = useRouter();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData(event.currentTarget);
            await createPost(formData);

            setOpen(false);
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            queryClient.invalidateQueries({ queryKey: ["my-posts"] });
            router.refresh(); // Refresh server components if any
        } catch (error) {
            console.error(error);
            alert("Failed to create post");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-2xl size-12 bg-accent text-foreground hover:bg-accent/80"
                    aria-label="Create Post"
                >
                    <Plus className="size-6" strokeWidth={2} />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Post</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="image">Image</Label>
                        <Input id="image" name="file" type="file" accept="image/*" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="caption">Caption</Label>
                        <Input id="caption" name="caption" placeholder="Write a caption..." />
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Post
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
