import React, { useState } from "react";
import {
  Phone,
  MapPin,
  Mail,
  CheckCircle2,
  Loader2,
  XCircle,
  Send,
  User,
  MessageSquare,
} from "lucide-react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setSuccess(false);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Send request to backend
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to send message");

      setSuccess(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.error("Contact form error:", err);
      setError(true);
      setTimeout(() => setError(false), 4000);
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      id: 1,
      label: "Phone Number",
      value: "+234 7077245802",
      icon: Phone,
      color: "bg-blue-50 text-blue-600",
      hoverColor: "hover:bg-blue-100",
    },
    {
      id: 2,
      label: "Address",
      value: "123 Abisogu Ave, Lagos State",
      icon: MapPin,
      color: "bg-emerald-50 text-emerald-600",
      hoverColor: "hover:bg-emerald-100",
    },
    {
      id: 3,
      label: "Email Address",
      value: "graceurt@gmail.com",
      icon: Mail,
      color: "bg-purple-50 text-purple-600",
      hoverColor: "hover:bg-purple-100",
    },
  ];

  const inputFields = [
    {
      name: "name",
      type: "text",
      placeholder: "Full Name",
      icon: User,
      required: true,
    },
    {
      name: "email",
      type: "email",
      placeholder: "Email Address",
      icon: Mail,
      required: true,
    },
    {
      name: "phone",
      type: "tel",
      placeholder: "Phone Number",
      icon: Phone,
      required: false,
    },
  ];

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
            Get In Touch
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Ready to start your enquiry or list your Apartment? We'd love to
            hear from you. Send us a message and we'll respond as soon as
            possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Contact Form */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl shadow-blue-100/50 p-8 lg:p-10 backdrop-blur-sm border border-white/20">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Input Fields */}
                {inputFields.map((field) => (
                  <div key={field.name} className="relative group">
                    <div className="relative">
                      <field.icon
                        className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                          focusedField === field.name
                            ? "text-blue-500"
                            : "text-gray-400"
                        }`}
                      />
                      <input
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        value={formData[field.name]}
                        onChange={handleChange}
                        onFocus={() => setFocusedField(field.name)}
                        onBlur={() => setFocusedField("")}
                        required={field.required}
                        className={`w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-xl transition-all duration-200 placeholder-gray-400 text-gray-700 focus:outline-none focus:bg-white focus:border-blue-500 focus:shadow-lg focus:shadow-blue-100/50 ${
                          focusedField === field.name
                            ? "transform scale-[1.02]"
                            : ""
                        }`}
                        style={{
                          transitionDelay:
                            focusedField === field.name ? "0ms" : "100ms",
                        }}
                      />
                    </div>
                  </div>
                ))}

                {/* Message Field */}
                <div className="relative group">
                  <div className="relative">
                    <MessageSquare
                      className={`absolute left-4 top-6 w-5 h-5 transition-colors duration-200 ${
                        focusedField === "message"
                          ? "text-blue-500"
                          : "text-gray-400"
                      }`}
                    />
                    <textarea
                      name="message"
                      placeholder="Drop a Message..."
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("message")}
                      onBlur={() => setFocusedField("")}
                      required
                      className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-xl transition-all duration-200 placeholder-gray-400 text-gray-700 focus:outline-none focus:bg-white focus:border-blue-500 focus:shadow-lg focus:shadow-blue-100/50 resize-none ${
                        focusedField === "message"
                          ? "transform scale-[1.02]"
                          : ""
                      }`}
                      style={{
                        transitionDelay:
                          focusedField === "message" ? "0ms" : "100ms",
                      }}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`group relative w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-xl shadow-blue-200/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-300/50 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden ${
                    loading ? "cursor-not-allowed" : ""
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                        <span>Send Message</span>
                      </>
                    )}
                  </div>
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Let's Start a Conversation
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We're here to help and answer any question you might have. We
                look forward to hearing from you.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <div
                  key={item.id}
                  className={`group flex items-start gap-4 p-6 bg-white rounded-xl shadow-lg shadow-gray-100/50 border border-gray-100 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 hover:scale-[1.02] hover:border-gray-200 ${item.hoverColor}`}
                  style={{
                    animationDelay: `${index * 150}ms`,
                  }}
                >
                  <div
                    className={`flex-shrink-0 p-3 ${item.color} rounded-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                  >
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-gray-800 transition-colors">
                      {item.label}
                    </h4>
                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Info */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
              <h4 className="font-semibold text-gray-900 mb-2">
                Business Hours
              </h4>
              <div className="space-y-1 text-gray-600">
                <p>Monday - Friday: 24/7</p>
                <p>Saturday: 24/7</p>
                <p>Sunday: 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {success && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl shadow-green-200/50 flex items-center gap-3 transform transition-all duration-500 hover:scale-105">
            <div className="flex-shrink-0">
              <CheckCircle2 className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <p className="font-medium">Message Sent Successfully!</p>
              <p className="text-green-100 text-sm">
                We'll get back to you soon.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="bg-red-500 text-white px-6 py-4 rounded-xl shadow-2xl shadow-red-200/50 flex items-center gap-3 transform transition-all duration-500 hover:scale-105">
            <div className="flex-shrink-0">
              <XCircle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <p className="font-medium">Something went wrong</p>
              <p className="text-red-100 text-sm">Please try again later.</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ContactForm;
