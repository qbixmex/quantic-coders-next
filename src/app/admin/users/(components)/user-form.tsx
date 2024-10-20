"use client";

import { FC, useEffect, useState } from "react";
import { createUser, updateUser } from "@/actions";
import { Button } from "@/components/ui/button";
import userCreateSchema from "@/actions/users/users_create.schema";
import userUpdateSchema from "@/actions/users/users_update.schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IoEye, IoEyeOff } from 'react-icons/io5';
import { Input } from "@/components/ui/input";
import { User } from "@/interfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Role } from "@/actions/users/role.enum";
import { Switch } from "@/components/ui/switch";

type FormValues = z.infer<typeof userUpdateSchema> | z.infer<typeof userCreateSchema>;

type Props = {
  user?: User;
};

const UserForm: FC<Props> = ({ user }) => {

  const router = useRouter();

  const [isPasswordVisible, setPasswordIsVisible] = useState(false);
  const [isPasswordConfirmVisible, setPasswordConfirmIsVisible] = useState(false);
  const [editPassword, setEditPassword] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(user ? userUpdateSchema : userCreateSchema),

    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      password: "",
      role: user?.role as Role ?? "",
      image: user?.image ?? "",
    },
  });

  useEffect(() => {
    if (!user) {
      setEditPassword(true);
    }
  }, [user]);

  const handlePasswordVisibly = () => {
    return setPasswordIsVisible(prev => !prev);
  };

  const handlePasswordConfirmVisibly = () => {
    return setPasswordConfirmIsVisible(prev => !prev);
  };

  const handleDisplayChangePassword = () => {
    setEditPassword(prev => !prev);
  };

  const onSubmit = async (values: FormValues) => {
    const formData = new FormData();

    formData.append('name', values.name);
    formData.append('email', values.email);
    formData.append('role', values.role ?? Role.SUBSCRIBER);
    formData.append('password', values.password ?? '');
    formData.append('image', values.image);

    let response: any;

    if (!user) {
      response = await createUser(formData);
    }

    if (user && user.id) {
      response = await updateUser(user.id, formData);
    }

    if (!response.ok) {
      toast.error(response.message, {
        duration: 3000,
        position: "top-right",
        className: "bg-red-500 text-white",
      });
    }

    if (response.ok) {
      toast.success(response.message, {
        duration: 3000,
        position: "top-right",
        className: "bg-green-500 text-white",
      });
    }

    form.reset();
    router.replace('/admin/users');
  };

  const onClose = () => {
    router.replace('/admin/users');
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6"
      >
        <div className="flex flex-col gap-y-4 w-full lg:w-1/2 lg:mx-auto">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="mb-4 md:mb-0">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input autoComplete="off" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input autoComplete="off" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="author">Author</SelectItem>
                        <SelectItem value="subscriber">Subscriber</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <Input autoComplete="off" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {user && (
            <div className="flex gap-x-3">
              <p className="text-sm">change password</p>
              <Switch onCheckedChange={handleDisplayChangePassword} />
            </div>
          )}
          {editPassword && (
            <>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={isPasswordVisible ? "text" : "password"}
                          autoComplete="off"
                          {...field}
                        />
                        {(isPasswordVisible)
                          ? <IoEye onClick={handlePasswordVisibly} className="absolute top-0 right-3 bottom-0 m-auto cursor-pointer" />
                          : <IoEyeOff onClick={handlePasswordVisibly} className="absolute top-0 right-3 bottom-0 m-auto cursor-pointer" />
                        }
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="passwordConfirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={isPasswordConfirmVisible ? "text" : "password"}
                          autoComplete="off"
                          {...field}
                        />
                        {(isPasswordConfirmVisible)
                          ? <IoEye onClick={handlePasswordConfirmVisibly} className="absolute top-0 right-3 bottom-0 m-auto cursor-pointer" />
                          : <IoEyeOff onClick={handlePasswordConfirmVisibly} className="absolute top-0 right-3 bottom-0 m-auto cursor-pointer" />
                        }
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          <div className="text-left md:text-right">
            <Button
              type="button"
              variant="primary"
              className="w-full md:w-fit mr-4"
              onClick={onClose}
            >
              close
            </Button>

            <Button
              type="submit"
              variant="success"
              className="w-full md:w-fit"
            >
              {user ? 'save' : 'create'}
            </Button>
          </div>
        </div>

      </form>
    </Form>
  );
};

export default UserForm;
