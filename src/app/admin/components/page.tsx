import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ComponentsPage() {
  const components = [
    { name: "HomePage", path: "src/app/page.tsx", type: "Page Layout", dependencies: "lucide-react, shadcn/card", status: "Live" },
    { name: "ProductPage", path: "src/app/products/[slug]/page.tsx", type: "Dynamic Page", dependencies: "lucide-react, prisma (mock)", status: "Live" },
    { name: "TradeRegister", path: "src/app/trade/register/page.tsx", type: "Form Layout", dependencies: "shadcn/input, shadcn/select", status: "Live" },
    { name: "AdminLayout", path: "src/app/admin/layout.tsx", type: "Dashboard Layout", dependencies: "Sidebar Pattern", status: "In Progress" },
    { name: "ProductCard", path: "src/components/ui/card.tsx", type: "UI Atom", dependencies: "radix-ui", status: "Stable" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-stone-900">Component Architecture</h1>
        <p className="text-stone-500">Registry of key layouts and UI patterns.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Component Name</TableHead>
                <TableHead>File Path</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Dependencies</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {components.map((comp) => (
                <TableRow key={comp.name}>
                  <TableCell className="font-medium">{comp.name}</TableCell>
                  <TableCell className="font-mono text-xs text-stone-500">{comp.path}</TableCell>
                  <TableCell>{comp.type}</TableCell>
                  <TableCell className="text-stone-500">{comp.dependencies}</TableCell>
                  <TableCell>
                    <Badge variant={comp.status === "Live" ? "default" : "secondary"}>
                      {comp.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
