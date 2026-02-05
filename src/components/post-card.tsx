import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";

interface Post {
    id: string;
    imageUrl: string;
    caption: string | null;
    createdAt: Date;
    user: {
        name: string;
        image: string | null;
    };
}

export function PostCard({ post }: { post: Post }) {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center gap-4 p-4">
                <Avatar>
                    <AvatarImage src={post.user.image || undefined} alt={post.user.name} />
                    <AvatarFallback>{post.user.name[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <p className="text-sm font-medium leading-none">{post.user.name}</p>
                    <p className="text-sm text-muted-foreground">
                        {new Date(post.createdAt).toLocaleDateString(undefined, {
                            dateStyle: "medium",
                        })}
                    </p>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="relative aspect-square w-full">
                    <img
                        src={post.imageUrl}
                        alt={post.caption || "Post image"}
                        className="w-full h-full object-cover"
                    />
                </div>
                {post.caption && (
                    <div className="p-4 pt-4">
                        <p className="text-sm">{post.caption}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
