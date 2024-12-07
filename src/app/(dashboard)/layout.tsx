import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"


interface DashboardLayoutProps{
    children: React.ReactNode
};

const DashboardLayout = ({children}: DashboardLayoutProps) => {
  return (
    <div className=" min-h-screen">
        <div className=" flex w-full h-full">
            <div className=" rounded-2xl fixed left-0 top-0 hidden lg:block lg:w-[264px] h-full overflow-y-auto shadow-md shadow-gray-500">
                <Sidebar />
            </div>
            <div className=" lg:pl-[264px] w-full">
                {/* TODO: Navbar */}
                <div className=" mx-auto max-w-screen-2xl h-full">
                    <Navbar />

                    <main className=" h-full py-8 px-6 flex flex-col">

                        {children} 
                    </main>
                </div>
            </div>
        </div>
    </div>
  )
}

export default DashboardLayout