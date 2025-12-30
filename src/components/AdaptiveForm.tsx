'use client'

import { useState } from 'react'
import { InputSchema } from '@/models/types'

interface AdaptiveFormProps {
    schema: InputSchema | null
    onChange: (data: Record<string, any>) => void
    disabled?: boolean
}

export default function AdaptiveForm({ schema, onChange, disabled }: AdaptiveFormProps) {
    const [formData, setFormData] = useState<Record<string, any>>({})

    if (!schema || !schema.fields || schema.fields.length === 0) {
        return null
    }

    const handleChange = (name: string, value: any) => {
        const newData = { ...formData, [name]: value }
        setFormData(newData)
        onChange(newData)
    }

    return (
        <div className="space-y-6">
            {schema.fields.map((field) => (
                <div key={field.name}>
                    <label htmlFor={field.name} className="block text-sm font-medium leading-6 text-white mb-2">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>

                    {field.type === 'select' ? (
                        <select
                            id={field.name}
                            required={field.required}
                            disabled={disabled}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                            className="block w-full rounded-md border-0 bg-white/5 py-2.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 [&_*]:bg-gray-900"
                        >
                            <option value="">Select an option</option>
                            {field.options?.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type={field.type}
                            id={field.name}
                            required={field.required}
                            disabled={disabled}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                            placeholder={`Enter ${field.label}`}
                            className="block w-full rounded-md border-0 bg-white/5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 placeholder:text-gray-500"
                        />
                    )}
                </div>
            ))}
        </div>
    )
}
