export function WaveDivider() {
    return (
        <div className="relative w-full overflow-hidden bg-black leading-[0]">
            <svg
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
                className="relative block h-16 w-full md:h-32"
                fill="none"
            >
                <path
                    d="M0,0 C150,90 400,10 600,60 C800,110 1050,10 1200,80 L1200,120 L0,120 Z"
                    fill="black"
                />
                <path
                    d="M0,0 C150,90 400,10 600,60 C800,110 1050,10 1200,80"
                    stroke="#f97316"
                    strokeWidth="4"
                    fill="none"
                />
            </svg>
        </div>
    )
}
