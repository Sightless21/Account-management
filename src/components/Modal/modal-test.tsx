'use client';
import { useEffect, useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ButtonGroup } from "@/components/ui/buttongroup";
import { Combobox } from "@/components/ui/combobox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTaskStore } from "@/hooks/useTaskStore";
import { ColumnType } from "../DnDKanBan/types";
import { toast } from "sonner";
import { z } from "zod";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type TaskModalProps = {
    mode: "create" | "edit" | "view";
    defaultValues?: z.infer<typeof formSchema>;
    projectId?: string | null;
    setLoading?: (loading: boolean) => void
};

const formSchema = z.object({
    id: z.string().optional(),
    taskName: z.string().min(2, { message: "Task name must be at least 2 characters." }),
    description: z.string(),
    priority: z.string(),
    status: z.string().optional(),
    assignees: z.array(z.string().optional()).default([]),
});

const employees = [
    { label: "John Doe", value: "john" },
    { label: "Jane Smith", value: "jane" },
    { label: "Bob Johnson", value: "bob" },
];

const parseMarkdown = (text: string) => {
    if (!text) return '';

    const html = text
        .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-3">$1</h1>')
        .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-2">$1</h2>')
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
        .replace(/^\- (.*)$/gm, '<li class="ml-4">$1</li>')
        .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-4 rounded font-mono">$1</pre>')
        .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded font-mono">$1</code>')
        .replace(/\n/g, '<br />');

    return html;
};

export function TaskModal({ defaultValues, mode, projectId, setLoading }: TaskModalProps) {
    const [currentMode, setCurrentMode] = useState<"view" | "edit" | "create">(mode);
    const [priority, setPriority] = useState<string>(defaultValues?.priority || "LOW");
    const handleModeSwitch = (mode: "view" | "edit" | "create") => setCurrentMode(mode);
    // Initialize editorContent with defaultValues if they exist
    const [editorContent, setEditorContent] = useState(defaultValues?.description || "");
    const [charCount, setCharCount] = useState(defaultValues?.description?.length || 0);
    const [showAlert, setShowAlert] = useState(false);
    const editorRef = useRef<HTMLDivElement>(null);
    // Add a ref to track initial render
    // const initialRenderRef = useRef(true);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: defaultValues || {
            id: "",
            taskName: "",
            description: "",
            priority: "LOW",
            status: "todo",
            assignees: [],
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
        if (charCount > 300) {
            setShowAlert(true);
            return;
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            if (e.shiftKey) {
                e.preventDefault();
                const selection = window.getSelection();
                const range = selection?.getRangeAt(0);

                if (range) {
                    // Create and insert the newline
                    const newlineNode = document.createTextNode('\n');
                    range.insertNode(newlineNode);

                    // Create a new range and set it after the newline
                    const newRange = document.createRange();
                    newRange.setStartAfter(newlineNode);
                    newRange.setEndAfter(newlineNode);

                    // Apply the new selection
                    selection?.removeAllRanges();
                    selection?.addRange(newRange);

                    // Update the form content
                    handleEditorChange();
                }
                return;
            }
            e.preventDefault();
            form.handleSubmit(onSubmit)();
        }
    };

    const applyFormat = (format: string) => {
        if (!editorRef.current) return;

        const selection = window.getSelection();
        if (!selection) return;
        const range = selection.getRangeAt(0);
        const text = range.toString();

        if (text) {
            let markdown = '';
            switch (format) {
                case 'Headers':
                    markdown = `# ${text}`;
                    break;
                case 'Headers2':
                    markdown = `## ${text}`;
                    break;
                case 'bold':
                    markdown = `**${text}**`;
                    break;
                case 'italic':
                    markdown = `*${text}*`;
                    break;
                case 'underline':
                    markdown = `_${text}_`;
                    break;
                case 'Codeblocks':
                    markdown = `\`\`\`\n${text}\n\`\`\``;
                    break;
                case 'Inline':
                    markdown = `\`${text}\``;
                    break;
                case 'newline':
                    markdown = `\n`;
                    break;
                default:
                    return;
            }

            const newNode = document.createTextNode(markdown);
            range.deleteContents();
            range.insertNode(newNode);
            handleEditorChange();
        }

        editorRef.current.focus();
    };

    const handleEditorChange = () => {
        if (editorRef.current) {
            // Store current cursor position
            const selection = window.getSelection();
            const range = selection?.getRangeAt(0);

            // Instead of storing just the offset, store the full path to the cursor
            // eslint-disable-next-line prefer-const
            let cursorPath: number[] = [];
            let currentNode: Node | null = range?.startContainer || null;

            while (currentNode && currentNode !== editorRef.current) {
                if (currentNode.parentNode) {
                    const siblings = Array.from(currentNode.parentNode.childNodes);
                    cursorPath.unshift(siblings.indexOf(currentNode as ChildNode));
                }
                currentNode = currentNode.parentNode;
            }

            // Store the final offset
            const offset = range?.startOffset || 0;
            cursorPath.push(offset);

            const text = editorRef.current.innerText;
            setEditorContent(text);
            setCharCount(text.length);
            form.setValue("description", text, { shouldDirty: true });

            // Restore cursor position using the path
            requestAnimationFrame(() => {
                if (!editorRef.current) return;

                let targetNode: Node = editorRef.current;

                // Navigate down the stored path
                for (let i = 0; i < cursorPath.length - 1; i++) {
                    const index = cursorPath[i];
                    if (targetNode.childNodes[index]) {
                        targetNode = targetNode.childNodes[index];
                    }
                }

                // Set the final cursor position
                const newRange = document.createRange();
                newRange.setStart(targetNode, cursorPath[cursorPath.length - 1]);
                newRange.setEnd(targetNode, cursorPath[cursorPath.length - 1]);

                selection?.removeAllRanges();
                selection?.addRange(newRange);
            });
        }
    };

    useEffect(() => {

        // Handle the initial render
        if (initialRenderRef.current) {
            if (currentMode === "view" && editorRef.current && defaultValues?.description) {
                const parsedContent = parseMarkdown(defaultValues.description);
                editorRef.current.innerHTML = parsedContent || '<p class="text-gray-400">No description</p>';
                return;
            }
            initialRenderRef.current = false;
        }

        if (!editorRef.current) return;
        
        // Handle mode changes and content updates
        if (editorRef.current) {
            if (currentMode === "view") {
                const parsedContent = parseMarkdown(defaultValues?.description || editorContent || '');
                editorRef.current.innerHTML = parsedContent || '<p class="text-gray-400">No description</p>';
            } else {
                editorRef.current.innerText = editorContent;
                // Move cursor to end only when switching modes
                const selection = window.getSelection();
                const range = document.createRange();
                const textNode = editorRef.current.firstChild || editorRef.current;
                if (textNode) {
                    range.selectNodeContents(textNode);
                    range.collapse(false);
                    selection?.removeAllRanges();
                    selection?.addRange(range);
                }
            }
        }
    }, [currentMode, editorContent, defaultValues?.description]);

    const getCharColor = () => {
        if (charCount >= 300) return "text-red-500";
        if (charCount >= 290) return "text-yellow-500";
        return "text-gray-500";
    };

    const displayCount = charCount > 300 ? `-${charCount - 300}` : charCount;

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    {currentMode === "view" || currentMode === "edit" ? (
                        <Button variant="link">View Task</Button>
                    ) : (
                        <Button variant="default">Create Task</Button>
                    )}
                </DialogTrigger>
                <DialogContent className="w-[900px]">
                    <DialogHeader>
                        <DialogTitle>{currentMode === "view" ? "View Task" : currentMode === "edit" ? "Edit Task" : "Create Task"}</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="taskName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Task Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter task name"
                                                {...field}
                                                disabled={currentMode === "view"}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Description (Markdown supported)</FormLabel>
                                        <FormControl>
                                            <div className={`border rounded-md ${charCount > 300 ? 'border-red-500' : ''}`}>
                                                <div className="flex border-b p-2 gap-2">
                                                    <ButtonGroup onClick={applyFormat} disabled={currentMode === "view"} />
                                                </div>
                                                <div
                                                    ref={editorRef}
                                                    contentEditable={currentMode !== "view"}
                                                    className="p-3 min-h-[100px] max-h-[300px] max-w-[848px] focus:outline-none whitespace-pre-wrap break-words overflow-y-auto"
                                                    onInput={handleEditorChange}
                                                    onKeyDown={handleKeyDown}
                                                    suppressContentEditableWarning={true}
                                                />
                                                <div className={`text-right text-sm p-3 ${getCharColor()}`}>
                                                    {displayCount}/300 characters
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button disabled={currentMode === "view"} variant="outline">
                                        {priority || "Select Priority"}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    <DropdownMenuLabel>Priority</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuRadioGroup
                                        onValueChange={(value) => {
                                            setPriority(value);
                                            form.setValue("priority", value);
                                        }}
                                    >
                                        <DropdownMenuRadioItem value="HIGH">
                                            High
                                        </DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="MEDIUM">
                                            Medium
                                        </DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="LOW">Low</DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <FormField
                                control={form.control}
                                name="assignees"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Assignees</FormLabel>
                                        <FormControl>
                                            <Combobox
                                                name="assignees"
                                                options={employees}
                                                placeholder="Select employees"
                                                value={(field.value || []).filter((v): v is string => v !== undefined)}
                                                onChange={(newValues) => field.onChange(newValues)}
                                                disabled={currentMode === "view"}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                {currentMode === "view" ? (
                                    <Button type="button" onClick={() => handleModeSwitch("edit")}>Edit</Button>
                                ) : currentMode === "create" ? (
                                    <Button type="submit">Create</Button>
                                ) : (
                                    <>
                                        <Button type="submit">Save Changes</Button>
                                        <Button type="button" variant="outline" onClick={() => handleModeSwitch("view")}>
                                            Cancel
                                        </Button>
                                    </>
                                )}
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Description Too Long</AlertDialogTitle>
                        <AlertDialogDescription>
                            The description cannot exceed 300 characters. Please shorten it.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setShowAlert(false)}>OK</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}