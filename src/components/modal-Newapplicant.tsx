'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SquareUserRound } from 'lucide-react';
import { Button } from "@/components/ui/button"
export default function ModalNewApplicant() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">New Applicant</Button>
            </DialogTrigger>
            <DialogContent className="sm:w-[1200px] min-h-28 ">
                <DialogHeader>
                    <DialogTitle>New Applicant</DialogTitle>
                    <DialogDescription>
                        Fill in the form below to create a new applicant.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {/* Info */}
                    <Card className="grid grid-cols-6">
                        <CardHeader className="flex">
                            <CardTitle>Infomation</CardTitle>
                            <CardDescription>ที่อยู่ปัจจุบัน</CardDescription>
                            <div className="flex justify-center">
                                <SquareUserRound size={70} />
                            </div>
                        </CardHeader>
                        <CardContent className="p-3 col-span-5 grid grid-rows-3 gap-3">
                            <div className="flex items-center gap-2 mb-2 grid-rows-1">
                                <Label className="" htmlFor="terms">เลขที่
                                </Label>
                                <Input className="w-20 h-5 text-center" placeholder="123/4" />
                                <Label className="" htmlFor="terms">หมู่ที่
                                </Label>
                                <Input className="w-16 h-5 text-center" placeholder="-" />
                                <Label className="" htmlFor="terms">ถนน
                                </Label>
                                <Input className="w-28 h-5 text-center" placeholder="พัฒนาการ 30" />
                                <Label className="" htmlFor="terms">ตำบล/แขวง
                                </Label>
                                <Input className="w-24 h-5 text-center" placeholder="สวนหลวง" />
                                <Label className="" htmlFor="terms">อำเภอ/เขต
                                </Label>
                                <Input className="w-24 h-5 text-center" placeholder="สวนหลวง" />
                                <Label className="" htmlFor="terms">จังหวัด
                                </Label>
                                <Input className="w-32 h-5 text-center" placeholder="กรุงเทพมหานคร" />
                            </div>
                            <div className="flex items-center gap-2 mb-2 grid-rows-1">
                                <Label className="" htmlFor="terms">รหัสไปรษณีย์
                                </Label>
                                <Input className="w-20 h-5 text-center" placeholder="10250" />
                                <Label className="" htmlFor="terms">เบอร์โทรศัพท์
                                </Label>
                                <Input className="w-32 h-5 text-center" placeholder="0987654321" />
                                <Label className="" htmlFor="terms">อีเมล
                                </Label>
                                <Input className="w-52 h-5 text-center" placeholder="john@test.com" />
                                <Label className="" htmlFor="terms">สัญชาติ
                                </Label>
                                <Input className="w-20 h-5 text-center" placeholder="ไทย" />
                                <Label className="" htmlFor="terms">เชื้อชาติ
                                </Label>
                                <Input className="w-20 h-5 text-center" placeholder="ไทย" />
                            </div>
                            <div className="flex items-center gap-2  grid-rows-1">
                                <Label className="" htmlFor="terms">ศาสนา
                                </Label>
                                <Input className="w-20 h-5 text-center" placeholder="พุทธ" />
                                <div className="flex flex-wrap">
                                    <div className="flex gap-2 mb-2">
                                        <Label className="" htmlFor="terms">ภาวะทางการทหาร:
                                        </Label>
                                        <Checkbox className="" id="thaiIdCard" />
                                        <Label className="text-gray-500" htmlFor="terms">ได้รับการยกเว้น</Label>
                                        <Checkbox className="" id="thaiIdCard" />
                                        <Label className="text-gray-500" htmlFor="terms">ปลดเป็นทหารกองหนุน</Label>
                                        <Checkbox className="" id="thaiIdCard" />
                                        <Label className="text-gray-500" htmlFor="terms">ยังไม่ได้รับการเกณฑ์</Label>
                                    </div>
                                    <div className="flex gap-2 mb-2 mr-2">
                                        <Label className="" htmlFor="terms">สถานภาพ:
                                        </Label>
                                        <Checkbox id="thaiIdCard" />
                                        <Label className="text-gray-500" htmlFor="terms">โสด</Label>
                                        <Checkbox id="thaiIdCard" />
                                        <Label className="text-gray-500" htmlFor="terms">แต่งงาน</Label>
                                        <Checkbox id="thaiIdCard" />
                                        <Label className="text-gray-500" htmlFor="terms">หย่าร้าง</Label>
                                    </div>
                                    <div className="flex gap-2 mb-2 ">
                                        <Label className="" htmlFor="terms">การอยู่อาศัย:
                                        </Label>
                                        <Checkbox id="thaiIdCard" />
                                        <Label className="text-gray-500" htmlFor="terms">อาศัยกับครอบครัว</Label>
                                        <Checkbox id="thaiIdCard" />
                                        <Label className="text-gray-500" htmlFor="terms">บ้านตัวเอง</Label>
                                        <Checkbox id="thaiIdCard" />
                                        <Label className="text-gray-500" htmlFor="terms">บ้านเช่า</Label>
                                        <Checkbox id="thaiIdCard" />
                                        <Label className="text-gray-500" htmlFor="terms">คอนโด</Label>
                                    </div>
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                    <div className="grid grid-cols-3 gap-4">
                        <Card className="max-h-[200px]">
                            <CardHeader>
                                <CardTitle>Documents</CardTitle>
                                <CardDescription>เอกสารสำหรับสมัครงาน</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                                    <div className="flex items-center space-x-2 gap-2">
                                        <Checkbox id="thaiIdCard" />
                                        <Label htmlFor="terms">สำเนาบัตรประชาชน</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 gap-2">
                                        <Checkbox id="" />
                                        <Label htmlFor="HouseRegis">สำเนาทะเบียนบ้าน</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 gap-2">
                                        <Checkbox id="Diploma" />
                                        <Label htmlFor="terms">สำเนาประกาศนียบัตร</Label>
                                    </div>
                                    <div className="flex items-center space-x-2  gap-2">
                                        <Checkbox id="bookBank" />
                                        <Label htmlFor="terms">สำเนาหน้าสมุดธนาคารกสิกร</Label>
                                    </div>
                                    <div className="flex items-center space-x-2  gap-2">
                                        <Checkbox id="other" />
                                        <Label htmlFor="terms">อื่นๆ (ถ้ามี) </Label>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        {/* Infomation */}
                        <Card className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 col-span-2">
                            <CardHeader>
                                <CardTitle>Personal</CardTitle>
                            </CardHeader>
                            <div className="grid grid-cols-2 gap-2 grid-rows-2">
                                <div className="items-center gap-4 mb-4">
                                    <Label htmlFor="name" className="text-left">
                                        Name
                                    </Label>
                                    <Input id="name" placeholder="John Doe" className="col-span-3" />
                                </div>
                                <div className="items-center gap-4 mb-4">
                                    <Label htmlFor="username" className="text-left">
                                        Position
                                    </Label>
                                    <Input id="username" placeholder="full-stack developer" className="col-span-3" />
                                </div>
                                <div className="items-center gap-4 mb-4">
                                    <Label htmlFor="username" className="text-left">
                                        Date of birth
                                    </Label>
                                    <Input id="username" placeholder="01/01/2000" className="col-span-3" />
                                </div>
                                <div className="items-center gap-4 mb-4">
                                    <Label htmlFor="username" className="text-left">
                                        salary expected
                                    </Label>
                                    <Input id="username" placeholder="10,000" className="col-span-3" />
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" variant={"default"}>New Applicant</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}