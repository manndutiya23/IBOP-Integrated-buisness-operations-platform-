import { Link } from "react-router-dom";

function FinanceModule() {
  const modules = [
    {
      title: "Add Expense",
      description: "Add and manage expense records",
      path: "/finance",
    },
    {
      title: "View Expenses",
      description: "View all expense entries",
      path: "/expenses",
    },
    {
      title: "View Invoices",
      description: "View all invoices",
      path: "/invoices",
    },
  ];

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Module</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">Finance</h2>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <Link
            key={module.path}
            to={module.path}
            className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-white/10"
          >
            <div className="flex h-full flex-col justify-between gap-8">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Section</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">{module.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{module.description}</p>
              </div>

              <span className="text-sm font-medium text-emerald-300 group-hover:text-emerald-200">
                Open section →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default FinanceModule;
