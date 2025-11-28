import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Building2 } from "lucide-react";

export default function TradeRegisterPage() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8">
        
        {/* LEFT: Value Proposition */}
        <div className="flex flex-col justify-center space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-stone-900">Join the EU Stone Trade Network</h1>
            <p className="mt-2 text-lg text-stone-600">
              Exclusive benefits for Fabricators, Architects, and Stone Retailers.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start">
              <CheckCircle2 className="w-6 h-6 text-green-600 mr-3 mt-0.5" />
              <div>
                <h3 className="font-medium text-stone-900">Trade Pricing Tiers</h3>
                <p className="text-sm text-stone-500">Access wholesale rates hidden from the public.</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle2 className="w-6 h-6 text-green-600 mr-3 mt-0.5" />
              <div>
                <h3 className="font-medium text-stone-900">Net-30 Payment Terms</h3>
                <p className="text-sm text-stone-500">Subject to credit approval after your first order.</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle2 className="w-6 h-6 text-green-600 mr-3 mt-0.5" />
              <div>
                <h3 className="font-medium text-stone-900">Dedicated Account Manager</h3>
                <p className="text-sm text-stone-500">Direct line for sourcing specific block origins.</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Registration Form */}
        <Card>
          <CardHeader>
            <CardTitle>Apply for a Trade Account</CardTitle>
            <CardDescription>Verification typically takes 24 hours.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" placeholder="John" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" placeholder="Doe" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Work Email</Label>
                <Input id="email" type="email" placeholder="john@company.com" required />
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <div className="relative">
                  <Building2 className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="company" className="pl-9" placeholder="Stone Works BV" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vat">VAT Number</Label>
                  <Input id="vat" placeholder="NL123456789B01" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kvk">KVK / CoC Number</Label>
                  <Input id="kvk" placeholder="12345678" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Business Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your primary business" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fabricator">Stone Fabricator</SelectItem>
                    <SelectItem value="architect">Architect / Designer</SelectItem>
                    <SelectItem value="retailer">Tile / Stone Retailer</SelectItem>
                    <SelectItem value="developer">Property Developer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full mt-4 bg-stone-900 hover:bg-stone-800">
                Submit Application
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



