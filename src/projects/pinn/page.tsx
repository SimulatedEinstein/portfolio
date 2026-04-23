export default function PINNProject() {
    return (
        <main className="bg-[#0B0F19] text-white min-h-screen px-10 py-20 max-w-5xl mx-auto">

            <h1 className="text-4xl font-bold mb-6">
                PINN-Based Jet Impingement on Cylinder
            </h1>

            {/* PROBLEM */}
            <section className="mb-10">
                <h2 className="text-2xl mb-2">Problem</h2>
                <p className="text-gray-400">
                    Traditional CFD simulations for jet impingement are computationally expensive.
                    This project explores Physics-Informed Neural Networks (PINNs) to solve
                    Navier-Stokes and energy equations efficiently.
                </p>
            </section>

            {/* METHOD */}
            <section className="mb-10">
                <h2 className="text-2xl mb-2">Methodology</h2>
                <p className="text-gray-400">
                    A fully connected neural network was trained using PDE residual loss
                    and boundary conditions including inlet, outlet, and cylinder wall constraints.
                </p>
            </section>

            {/* RESULTS */}
            <section>
                <h2 className="text-2xl mb-4">Results</h2>

                <div className="grid md:grid-cols-2 gap-6">
                    <img src="/images/velocity.png" className="rounded-xl" />
                    <img src="/images/pressure.png" className="rounded-xl" />
                </div>

                <p className="text-gray-400 mt-4">
                    Achieved less than 2% error compared to benchmark CFD results.
                </p>
            </section>

        </main>
    );
}