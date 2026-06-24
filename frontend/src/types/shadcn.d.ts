// Ambient declarations to let TypeScript accept the un-typed shadcn .jsx components
// from /app/frontend/src/components/ui/* without strict prop checking.
declare module "@/components/ui/accordion" {
  export const Accordion: any;
  export const AccordionContent: any;
  export const AccordionItem: any;
  export const AccordionTrigger: any;
}
declare module "@/components/ui/alert" {
  export const Alert: any;
  export const AlertDescription: any;
  export const AlertTitle: any;
}
declare module "@/components/ui/avatar" {
  export const Avatar: any;
  export const AvatarFallback: any;
  export const AvatarImage: any;
}
declare module "@/components/ui/badge" {
  export const Badge: any;
  export const badgeVariants: any;
}
declare module "@/components/ui/button" {
  export const Button: any;
  export const buttonVariants: any;
}
declare module "@/components/ui/card" {
  export const Card: any;
  export const CardContent: any;
  export const CardDescription: any;
  export const CardFooter: any;
  export const CardHeader: any;
  export const CardTitle: any;
}
declare module "@/components/ui/checkbox" {
  export const Checkbox: any;
}
declare module "@/components/ui/dialog" {
  export const Dialog: any;
  export const DialogContent: any;
  export const DialogDescription: any;
  export const DialogFooter: any;
  export const DialogHeader: any;
  export const DialogTitle: any;
  export const DialogTrigger: any;
  export const DialogClose: any;
}
declare module "@/components/ui/dropdown-menu" {
  export const DropdownMenu: any;
  export const DropdownMenuContent: any;
  export const DropdownMenuItem: any;
  export const DropdownMenuLabel: any;
  export const DropdownMenuSeparator: any;
  export const DropdownMenuTrigger: any;
}
declare module "@/components/ui/input" {
  export const Input: any;
}
declare module "@/components/ui/label" {
  export const Label: any;
}
declare module "@/components/ui/popover" {
  export const Popover: any;
  export const PopoverContent: any;
  export const PopoverTrigger: any;
}
declare module "@/components/ui/scroll-area" {
  export const ScrollArea: any;
  export const ScrollBar: any;
}
declare module "@/components/ui/select" {
  export const Select: any;
  export const SelectContent: any;
  export const SelectGroup: any;
  export const SelectItem: any;
  export const SelectLabel: any;
  export const SelectSeparator: any;
  export const SelectTrigger: any;
  export const SelectValue: any;
}
declare module "@/components/ui/separator" {
  export const Separator: any;
}
declare module "@/components/ui/sheet" {
  export const Sheet: any;
  export const SheetClose: any;
  export const SheetContent: any;
  export const SheetDescription: any;
  export const SheetFooter: any;
  export const SheetHeader: any;
  export const SheetTitle: any;
  export const SheetTrigger: any;
}
declare module "@/components/ui/skeleton" {
  export const Skeleton: any;
}
declare module "@/components/ui/slider" {
  export const Slider: any;
}
declare module "@/components/ui/switch" {
  export const Switch: any;
}
declare module "@/components/ui/table" {
  export const Table: any;
  export const TableBody: any;
  export const TableCaption: any;
  export const TableCell: any;
  export const TableFooter: any;
  export const TableHead: any;
  export const TableHeader: any;
  export const TableRow: any;
}
declare module "@/components/ui/tabs" {
  export const Tabs: any;
  export const TabsContent: any;
  export const TabsList: any;
  export const TabsTrigger: any;
}
declare module "@/components/ui/textarea" {
  export const Textarea: any;
}
declare module "@/components/ui/toast" {
  export const Toast: any;
  export const ToastAction: any;
  export const ToastClose: any;
  export const ToastDescription: any;
  export const ToastProvider: any;
  export const ToastTitle: any;
  export const ToastViewport: any;
}
declare module "@/components/ui/tooltip" {
  export const Tooltip: any;
  export const TooltipContent: any;
  export const TooltipProvider: any;
  export const TooltipTrigger: any;
}
declare module "@/components/ui/sonner" {
  export const Toaster: any;
}
declare module "@/lib/utils" {
  export function cn(...inputs: any[]): string;
}
