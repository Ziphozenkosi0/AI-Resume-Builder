import { ResumeData } from "@/types/resume";

interface TemplateProps {
  data: ResumeData;
}

const ClassicTemplate = ({ data }: TemplateProps) => {
  const { personalInfo, experiences, education, skills } = data;

  return (
    <div className="max-w-[800px] mx-auto text-gray-900 font-serif">
      {/* Header */}
      <div className="text-center mb-6 pb-4 border-b border-gray-400">
        <h1 className="text-3xl font-bold mb-3">
          {personalInfo.fullName || "Your Name"}
        </h1>
        <div className="text-sm text-gray-600 space-y-1">
          {personalInfo.email && <p>{personalInfo.email}</p>}
          {personalInfo.phone && <p>{personalInfo.phone}</p>}
          {personalInfo.location && <p>{personalInfo.location}</p>}
          {(personalInfo.linkedin || personalInfo.website) && (
            <p>
              {personalInfo.linkedin && <span>{personalInfo.linkedin} </span>}
              {personalInfo.website && <span>{personalInfo.website}</span>}
            </p>
          )}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-3">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-3">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="mb-2">
                  <h3 className="font-bold">{exp.position}</h3>
                  <p className="text-gray-700 italic">
                    {exp.company} | {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </p>
                </div>
                {exp.description && (
                  <p className="text-gray-700 mb-2">{exp.description}</p>
                )}
                {exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {exp.achievements.map((achievement, idx) => (
                      <li key={idx}>{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-3">
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <h3 className="font-bold">{edu.degree} in {edu.field}</h3>
                <p className="text-gray-700">
                  {edu.institution} | {edu.startDate} - {edu.endDate}
                </p>
                {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-3">
            Skills
          </h2>
          <p className="text-gray-700">
            {skills.map((skill) => skill.name).join(" • ")}
          </p>
        </div>
      )}
    </div>
  );
};

export default ClassicTemplate;
