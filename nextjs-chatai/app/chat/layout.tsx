import Dashboard from "@/components/dashboard";


export default function Layout({ children }: any) {
    return (
        <>
            <div className="grid grid-cols-8 gap-2">
                <Dashboard />
                <div className="col-start-2 col-end-9">
                    <main>{children}</main>
                </div>
            </div>
        </>
    )
}