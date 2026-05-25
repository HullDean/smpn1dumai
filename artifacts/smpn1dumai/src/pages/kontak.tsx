import { useGetProfil } from "@workspace/api-client-react";
import { MapPin, Phone, Mail, Globe, Clock } from "lucide-react";
import { AnimatedSection } from "@/components/animation";

export default function Kontak() {
  const { data: profil } = useGetProfil();

  const contactItems = [
    {
      icon: <MapPin size={20} />,
      label: "Alamat",
      value: profil?.alamat || "Jl. Pattimura No. 1, Dumai, Riau 28826",
      isMultiline: true,
    },
    {
      icon: <Phone size={20} />,
      label: "Telepon",
      value: profil?.telepon || "(0765) 31234",
    },
    {
      icon: <Mail size={20} />,
      label: "Email",
      value: profil?.email || "smpn1dumai@gmail.com",
    },
    ...(profil?.website
      ? [{
          icon: <Globe size={20} />,
          label: "Website",
          value: profil.website,
          isLink: true,
        }]
      : []),
    {
      icon: <Clock size={20} />,
      label: "Jam Operasional",
      value: "Senin – Sabtu\n07.00 – 15.00 WIB",
      isMultiline: true,
    },
  ];

  return (
    <div>
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2a5298] text-white py-20 relative overflow-hidden">
        <div className="absolute top-6 right-12 w-40 h-40 rounded-full border-2 border-[#c9a84c]/15 pointer-events-none" />
        <div className="absolute bottom-4 left-8 w-24 h-24 rounded-full bg-[#c9a84c]/10 pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <p className="text-[#c9a84c] font-semibold uppercase tracking-widest text-sm mb-3">Hubungi Kami</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Kontak Sekolah</h1>
          <p className="text-blue-100 text-lg max-w-xl mx-auto">
            Jangan ragu untuk menghubungi kami. Kami siap membantu Anda.
          </p>
        </div>
      </div>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <AnimatedSection variant="slideLeft">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 h-full">
                <h2 className="text-2xl font-bold text-primary mb-6">Informasi Kontak</h2>
                <div className="space-y-2">
                  {contactItems.map(({ icon, label, value, isMultiline, isLink }) => (
                    <div
                      key={label}
                      className="flex items-start gap-4 p-3 rounded-lg hover:bg-primary/5 transition-colors duration-200 group cursor-default"
                    >
                      <div className="w-11 h-11 bg-primary/10 rounded-full flex items-center justify-center shrink-0 text-primary group-hover:text-[#c9a84c] transition-colors duration-200">
                        {icon}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground mb-0.5">{label}</p>
                        {isLink ? (
                          <a
                            href={value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary text-sm hover:underline"
                          >
                            {value}
                          </a>
                        ) : isMultiline ? (
                          value.split("\n").map((line, i) => (
                            <p key={i} className="text-muted-foreground text-sm leading-relaxed">{line}</p>
                          ))
                        ) : (
                          <p className="text-muted-foreground text-sm break-all">{value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* Google Maps Embed */}
            <AnimatedSection variant="slideRight">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full min-h-80">
                <div className="flex-1 relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.0!2d101.4!3d1.67!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d4b8e0a0000001%3A0x0!2sSMP+Negeri+1+Dumai!5e0!3m2!1sid!2sid!4v1"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full min-h-64 border-0"
                    title="Lokasi SMP Negeri 1 Dumai"
                  />
                </div>
                <div className="p-5 border-t border-gray-100">
                  <p className="text-sm text-muted-foreground text-center">
                    {profil?.nama_sekolah || "SMP Negeri 1 Dumai"} &mdash; NPSN {profil?.npsn || "10401601"}
                  </p>
                  <div className="text-center mt-2">
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=SMP+Negeri+1+Dumai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary font-semibold hover:underline"
                    >
                      Buka di Google Maps ↗
                    </a>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}
