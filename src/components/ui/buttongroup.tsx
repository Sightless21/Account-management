import React from 'react';
import { Button } from '@/components/ui/button'; // หรือลิงค์ไปยัง Button ของคุณถ้าใช้ UI อื่น
import { Underline, Bold, Italic, Code , ChevronsLeftRightEllipsis ,Heading1 , Heading2} from 'lucide-react'; // หรืออิมพอร์ตไอคอนที่ต้องการ

type ButtonGroupProps = {
    onClick: (format: string) => void;
    disabled?: boolean;
};

export const ButtonGroup: React.FC<ButtonGroupProps> = ({ onClick, disabled = false }) => {
    return (
        <div className="flex gap-1">
            <Button variant={"ghost"} onClick={() => onClick("Headers")} disabled={disabled}>
                <Heading1 className="h-4 w-4" />
            </Button>
            <Button variant={"ghost"} onClick={() => onClick("Headers2")} disabled={disabled}>
                <Heading2 className="h-4 w-4" />
            </Button>
            <Button variant={"ghost"} onClick={() => onClick("bold")} disabled={disabled}>
                <Bold className="h-4 w-4" />
            </Button>
            <Button variant={"ghost"} onClick={() => onClick("italic")} disabled={disabled}>
                <Italic className="h-4 w-4" />
            </Button>
            <Button variant={"ghost"} onClick={() => onClick("underline")} disabled={disabled}>
                <Underline className="h-4 w-4" />
            </Button>
            <Button variant={"ghost"} onClick={() => onClick("Codeblocks")} disabled={disabled}>
                <Code className="h-4 w-4" />
            </Button>
            <Button variant={"ghost"} onClick={() => onClick("Inline")} disabled={disabled}>
                <ChevronsLeftRightEllipsis className="h-4 w-4" />
            </Button>
        </div>
    );
};