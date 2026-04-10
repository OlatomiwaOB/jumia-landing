import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { RegistrationData } from '../bnpl'


type PersonalProps = {
    form: UseFormReturn<RegistrationData, any, RegistrationData>
}
const Personal = ({ form }: PersonalProps) => {
  return (
    <>
        <FormField
        control={form.control}
        name="firstname"
        render={({ field }) => (
            <FormItem>
            <FormLabel>First Name</FormLabel>
            <FormControl>
                <Input placeholder="John" {...field} />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />

         <FormField
        control={form.control}
        name="lastname"
        render={({ field }) => (
            <FormItem>
            <FormLabel>Last Name</FormLabel>
            <FormControl>
                <Input placeholder="Doe" {...field} />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />

        <div className="grid grid-cols-2 gap-4">
        <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                <Input type="email" placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />

        <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                <Input placeholder="+44 7123 456789" {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        </div>

        <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
            <FormItem>
            <FormLabel>Address</FormLabel>
            <FormControl>
                <Textarea placeholder="123 Main Street, London, UK" {...field} />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />
      <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                <Input type="password" placeholder="Enter your password" {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
    </>
  )
}

export default Personal