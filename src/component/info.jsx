// src/components/InfoPart.jsx
import React from "react";

export default function InfoPart() {
  return (
    <section className=" text-gray-800 py-12 px-4 lg:px-20 font-sans">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-2">
            Motor Vehicles Law
          </h2>
          <p className="italic text-gray-700 text-base md:text-lg">
            The whole aspects of law relating to Motor Vehicles. Your Up-to-theMinute Guide to Dynamic Regulations
          </p>
          <hr className="mt-4 border-gray-300 max-w-xs mx-auto" />
        </div>

        {/* Description */}
        <div className="text-[16px] md:text-[17px] text-gray-800 space-y-5 leading-relaxed">
          <p>
            Welcome to the <strong>Motor Vehicles Law Hub</strong> - your central source for real-time updates
            and insights into the ever-evolving landscape of Motor Vehicles Act, 1988 followed by its
            Central Motor Vehicles Rules 1989. Our website is dedicated to providing you with the latest
            amendments, rules, and legal developments, ensuring that you stay ahead in understanding the
            intricacies of the Motor Vehicles Laws of Central and State statutes.
          </p>
        </div>

        {/* Key Features */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-600">Key Features</h3>
        </div>

        {/* Features List */}
        <div className="space-y-8 text-[16px] text-gray-900 leading-relaxed">
          <div>
            <p>
              <strong>Live Updates:</strong><br />
              Our website keeps you informed with live updates as the Motor Vehicles Laws undergoes continuous
              amendments. Central Motor Vehicles Rule 1989 and State Rules continuously amended for latest updates.
              Stay ahead of the curve with real-time information on changes, additions, and revisions to the law,
              ensuring that you are always aware of the latest legal requirements.
            </p>
          </div>

          <div>
            <p>
              <strong>Comprehensive Act and Rules:</strong><br />
              Access the full text of the Motor Vehicles Law and its accompanying Rules with ease. Our user-friendly
              interface allows you to explore the legislation effortlessly, making it a valuable resource for legal
              professionals, researchers, and anyone seeking a deep understanding of motor vehicles law.
            </p>
          </div>

          <div>
            <p>
              <strong>Searchable Database:</strong><br />
              Utilize our powerful search feature to find specific sections, rules, or amendments within the Motor
              Vehicles Act and Rules. Save time and access relevant information promptly, whether you're conducting
              legal research, preparing for a case, or simply seeking clarity on a particular aspect of the law.
            </p>
          </div>

          <div>
            <p>
              <strong>Notifications:</strong><br />
              Every amendment notification is attached with the content, and you can easily download the original
              notification for your records and reference.
            </p>
          </div>

          <div>
            <p>
              <strong>Case Laws:</strong><br />
              Each section of the Act is updated with relevant case laws of the Supreme Court as well as High Courts,
              helping to identify the judicial interpretation and application of every section.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
