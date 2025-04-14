import Image from "next/image";
import Link from "next/link";
import { PiFarm } from "react-icons/pi";

export default function Home() {
  return (
    <div className=" w-full bg-[#012D33]  min-h-screen relative">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]  transform-gpu overflow-hidden  blur-3xl"
      >
        <div className="mx-auto aspect-[1155/678] rounded-full w-[50rem] bg-gradient-to-tr from-[#D3CDBD] to-[#E3BC87] opacity-30" />
      </div>
      <header className=" w-full border-b border-b-white/10 py-6">
        <div className=" w-[90%] mx-auto flex items-center justify-between">
          <div className=" flex items-center space-x-5">
            <PiFarm className=" text-cyan-200 w-10 h-10" />
            <h1 className=" font-bold text-3xl uppercase text-white">
              My FarmPlace
            </h1>
          </div>

          <div className=" flex items-center space-x-3">
            <Link
              href={"/auth/farmers"}
              className=" bg-yellow-500 rounded-full px-10 py-4 font-semibold"
            >
              Farmer Login
            </Link>
            <Link
              href={"/auth/admin"}
              className=" border-yellow-500 border-2 text-yellow-500 rounded-full px-10 py-4 font-semibold"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </header>
      <main className=" w-full text-center pt-14">
        <h1 className=" text-[#F6FFFF] text-balance justify-center text-8xl capitalize font-semibold max-w-[60%] leading-[7rem] mx-auto">
          keep up to date with farm products.
        </h1>

        <p className=" text-[#F6FFFF]/50 text-xl capitalize max-w-[50%] text-pretty mt-6 justify-center leading-[2rem] mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci
          maxime voluptatum atque, velit eaque doloribus minus laudantium
          aliquid repudiandae ipsa odit eveniet consequatur error, eius nesciunt
          cupiditate at corporis! Provident!
        </p>

        <div className=" pt-20 space-x-5 flex items-center">
          <div className=" bg-red-300 rounded-3xl h-[40vh] w-[14vw] relative overflow-hidden">
            <Image
              src={"/images/jonny-swales-s1MW71bEHEc-unsplash.jpg"}
              fill
              alt=""
              className=" object-center object-cover"
            />
          </div>
          <div className=" bg-red-300 rounded-full h-[40vh] relative overflow-hidden  w-[14vw]">
            <Image
              src={"/images/paul-engel-Egz8FC60ngM-unsplash.jpg"}
              fill
              alt=""
              className=" object-center object-cover"
            />
          </div>
          <div className=" bg-red-300 rounded-full h-[40vh] relative overflow-hidden  w-[40vw]">
            <Image
              src={"/images/thomas-gamstaetter-IFGVE61AAno-unsplash.jpg"}
              fill
              alt=""
              className=" object-center object-cover"
            />
          </div>
          <div className=" bg-red-300 rounded-3xl h-[40vh]  relative overflow-hidden w-[14vw]">
            <Image
              src={"/images/jonny-swales-s1MW71bEHEc-unsplash.jpg"}
              fill
              alt=""
              className=" object-center object-cover"
            />
          </div>
          <div className=" bg-red-300 rounded-[50%] h-[40vh] w-[20vw] relative overflow-hidden">
            <Image
              src={"/images/max-O_TVsaeZNlE-unsplash.jpg"}
              fill
              alt=""
              className=" object-center object-cover"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
