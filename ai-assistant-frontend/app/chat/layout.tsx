import Dashboard from "@/components/dashboard";

export default function Layout({ children }: any) {
    return (
        <>
            <div className="grid grid-cols-10 gap-2">
                <Dashboard />
                <div className="col-start-3 col-end-10">
                    <main>
                        {children}
                    </main>
                </div>
            </div>
        </>
    )
}