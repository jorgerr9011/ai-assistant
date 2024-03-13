import Dashboard from "../components/dashboard";

export default function DashboardLayout({children}: {
    children: React.ReactNode;
  }) {
    return (
        <section>
            <div className="grid grid-cols-8 gap-2">
                <Dashboard />
                <div className="col-start-2 col-end-9">
                    {children}
                </div>
            </div>
        </section> 
    )
  }