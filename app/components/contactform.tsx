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
        <label className="text-2xl">
          Name <span className="text-gray-400">*</span>
        </label>
        <input
          type="text"
          required
          placeholder="Your name"
          className="bg-transparent border-b border-gray-700 py-2 outline-none focus:border-gray-400 transition-colors"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-2xl">
          Email <span className="text-gray-400">*</span>
        </label>
        <input
          type="email"
          required
          placeholder="Your email"
          className="bg-transparent border-b border-gray-700 py-2 outline-none focus:border-gray-400 transition-colors"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-2xl">
          Company <span className="text-gray-400">*</span>
        </label>
        <input
          type="text"
          required
          placeholder="Your company"
          className="bg-transparent border-b border-gray-700 py-2 outline-none focus:border-gray-400 transition-colors"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-2xl">Project Information</label>
        <textarea
          placeholder="Please give a detailed of the project"
          rows={4}
          className="bg-transparent border-b border-gray-700 py-2 outline-none focus:border-gray-400 transition-colors resize-none"
          value={formData.projectInfo}
          onChange={(e) => setFormData({ ...formData, projectInfo: e.target.value })}
        />
      </div>

      <button
        type="submit"
        className="bg-white text-black py-4 px-8 rounded-full text-lg font-bold hover:bg-gray-100 transition-colors mt-6"
      >
        Send
      </button>
    </form>
  )
}