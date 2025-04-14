"use client";

import Link from "next/link";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { BsExclamationCircle } from "react-icons/bs";
import {
  ChevronUp,
  Loader,
  MessageCircle,
  Paperclip,
  UserCircle
} from "lucide-react";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { postForumPost } from "@/lib/actions";
import { GrUserAdmin } from "react-icons/gr";
import useSWR from "swr";

const initialState = {
  message: ""
};

const fetcher = (url) => fetch(url).then((res) => res.json());
export default function PostsPage() {
  const [state, formAction, pending] = useActionState(
    postForumPost,
    initialState
  );

  const { data, error, isLoading } = useSWR("/api/post", fetcher, {
    refreshInterval: 1
  });

  console.log(data);

  useEffect(() => {
    if (state.message == "success") {
      toast.success("Accound created");
    } else if (state.message == "unsuccess") {
      toast.error("Invalid credentials");
    }
  }, [state]);
  return (
    <ContentLayout title="All Posts">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Posts</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card className=" space-y-5 w-fulll p-8 h-[80vh] flex flex-col justify-between  overflow-y-scroll mt-6">
        <div className=" space-y-4">
          <CardTitle>
            <div className=" p-5 space-y-2 border-2 shadow-sm rounded-lg border-gray-100">
              <h1 className=" text-2xl font-medium">Forum</h1>
              <p className=" text-gray-500 font-normal">
                Welcome to the community and discussion
              </p>
            </div>
            <div className=" flex items-center space-x-4 px-6 py-3 rounded-lg bg-yellow-500/10 w-full mt-4">
              <BsExclamationCircle className=" text-yellow-600" />
              <p className=" text-yellow-700 font-normal">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. In,
                laborum rerum blanditiis explicabo consequatur quia.
                Perspiciatis
              </p>
            </div>
          </CardTitle>
          <CardContent className=" space-y-4">
            {!error && !isLoading ? (
              data?.data.map((item, index) => {
                return (
                  <div key={index}>
                    <div className=" bg-slate-50 rounded-lg p-4 flex items-start space-x-4">
                      {item?.name == "admin" ? <GrUserAdmin /> : <UserCircle />}
                      <div>
                        <p
                          className={`${
                            item?.name == "admin"
                              ? " capitalize font-bold text-green-600 "
                              : "text-blue-600 font-medium"
                          } `}
                        >
                          {item?.name}
                        </p>
                        <p className=" text-gray-500 font-normal">
                          {item?.content}
                        </p>
                        {item?.comment != null && (
                          <div className=" flex items-center space-x-4 mt-6 text-blue-600 font-medium">
                            <MessageCircle />
                            <p>2 replies</p>
                            <ChevronUp />
                          </div>
                        )}
                      </div>
                    </div>
                    {/*  <div className=" pl-16 pt-6 space-y-6">
                  <div className=" flex items-start space-x-4">
                    <div className=" w-8 h-8 bg-red-500 rounded-[50%]"></div>
                    <div>
                      <p className=" text-gray-800 font-medium">Uche Doe</p>
                      <p className=" text-gray-500 font-normal">
                        Lorem ipsum dolor, sit amet consectetur adipisicing
                      </p>
                    </div>
                  </div>
                  <div className="  flex items-start space-x-4">
                    <div className=" w-8 h-8 bg-red-500 rounded-[50%]"></div>
                    <div>
                      <p className=" text-gray-800 font-medium">Mary Jane</p>
                      <p className=" text-gray-500 font-normal">
                        Lorem ipsum dolor, sit amet consectetur adipisicing
                      </p>
                    </div>
                  </div>
                </div> */}
                  </div>
                );
              })
            ) : (
              <div className=" w-full h-28 bg-gray-200 rounded-md animate-pulse"></div>
            )}
          </CardContent>
        </div>
        <CardFooter>
          <form
            action={formAction}
            method="POST"
            className=" w-full flex items-center justify-between px-6 py-3 border border-gray-300 mt-6 rounded-lg"
          >
            <div className=" flex w-[90%] items-center space-x-8">
              <Paperclip />
              <input
                name="reply"
                type="text"
                placeholder="Enter reply"
                className=" w-full border-none outline-transparent"
              />
            </div>
            <button type="submit">
              {pending ? (
                <div className=" flex items-center space-x-2">
                  <Loader className="animate-spin text-black" />
                </div>
              ) : (
                <PaperPlaneIcon />
              )}
            </button>
          </form>
        </CardFooter>
      </Card>
    </ContentLayout>
  );
}
