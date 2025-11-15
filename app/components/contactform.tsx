'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    projectInfo: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-6 ">
      <div className="flex flex-col space-y-2">
        <label className="text-2xl text-stone-300">
          Name <span className="text-stone-400">*</span>
        </label>
        <input
          type="text"
          required
          placeholder="Your name"
          className="bg-transparent border-b border-[var(--border-color)] py-2 outline-none focus:border-gray-400 transition-colors text-stone-400 placeholder:text-stone-500"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-2xl text-stone-300">
          Email <span className="text-stone-400">*</span>
        </label>
        <input
          type="email"
          required
          placeholder="Your email"
          className="bg-transparent border-b border-[var(--border-color)] py-2 outline-none focus:border-gray-400 transition-colors text-stone-400 placeholder:text-stone-500"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-2xl text-stone-300">
          Company <span className="text-stone-400">*</span>
        </label>
        <input
          type="text"
          required
          placeholder="Your company"
          className="bg-transparent border-b border-[var(--border-color)] py-2 outline-none focus:border-gray-400 transition-colors text-stone-400 placeholder:text-stone-500"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-2xl text-stone-300">Project Information</label>
        <textarea
          placeholder="Please give a detailed of the project"
          rows={4}
          className="bg-transparent border-b border-[var(--border-color)] py-2 outline-none focus:border-gray-400 transition-colors resize-none text-stone-400 placeholder:text-stone-500"
          value={formData.projectInfo}
          onChange={(e) => setFormData({ ...formData, projectInfo: e.target.value })}
        />
      </div>

      <button
        type="submit"
        className="bg-stone-300 text-black py-4 px-8 rounded-full text-lg font-bold hover:bg-stone-400 transition-colors mt-6"
      >
        Send
      </button>
    </form>
  )
}