
const steps = [
    { id: 'pending', name: 'Payment' },
    { id: 'escrow', name: 'Escrow' },
    { id: 'completed', name: 'Completed' },
]

export default function OrderTracker({ status, lang }: { status: string, lang: string }) {
    const currentStepIdx = steps.findIndex((step) => step.id === status)

    // Mapping for localization (simple map for now, ideally use dictionary)
    const dict: any = {
        en: { payment: 'Payment', escrow: 'Escrow', completed: 'Completed' },
        ru: { payment: 'Оплата', escrow: 'Эскроу', completed: 'Завершено' }
    }
    const t = dict[lang] || dict['en']

    return (
        <div className="w-full py-6">
            <nav aria-label="Progress">
                <ol role="list" className="flex items-center">
                    {steps.map((step, stepIdx) => {
                        const isComplete = (status === 'completed' && step.id !== 'completed') || (status === 'escrow' && step.id === 'pending')
                        const isCurrent = step.id === status

                        return (
                            <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''} flex-1`}>
                                {stepIdx !== steps.length - 1 && (
                                    <div className="absolute top-4 left-0 -right-0 w-full" aria-hidden="true">
                                        <div className="h-0.5 w-full bg-gray-700">
                                            <div
                                                className="h-0.5 bg-indigo-600 transition-all duration-500"
                                                style={{ width: isComplete ? '100%' : isCurrent ? '50%' : '0%' }}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="group relative flex flex-col items-center justify-center">
                                    <span className="flex h-9 items-center">
                                        <span className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 ${isComplete || isCurrent ? 'border-indigo-600 bg-indigo-600' : 'border-gray-600 bg-gray-800'
                                            }`}>
                                            {isComplete ? (
                                                <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                                </svg>
                                            ) : isCurrent ? (
                                                <span className="h-2.5 w-2.5 rounded-full bg-white" />
                                            ) : (
                                                <span className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-600" />
                                            )}
                                        </span>
                                    </span>
                                    <span className="ml-0 mt-2 min-w-max text-xs font-medium text-gray-400 group-hover:text-gray-300">
                                        {t[step.id] || step.name}
                                    </span>
                                </div>
                            </li>
                        )
                    })}
                </ol>
            </nav>
        </div>
    )
}
