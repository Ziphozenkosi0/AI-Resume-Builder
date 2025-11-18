import { ResumeData } from "@/types/resume";

interface TemplateProps {
  data: ResumeData;
}

const MinimalTemplate = ({ data }: TemplateProps) => {
  const { personalInfo, experiences, education, skills } = data;

  return (
    <div className="max-w-[800px] mx-auto text-gray-900 font-sans">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-light mb-2">
          {personalInfo.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>•</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>•</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
        {(personalInfo.linkedin || personalInfo.website) && (
          <div className="flex flex-wrap gap-3 text-sm text-gray-600 mt-1">
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
            {personalInfo.website && personalInfo.linkedin && <span>•</span>}
            {personalInfo.website && <span>{personalInfo.website}</span>}
          </div>
        )}
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mb-8">
          <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">
            Experience
          </h2>
          <div className="space-y-6">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="mb-2">
                  <h3 className="font-semibold text-lg">{exp.position}</h3>
                  <div className="flex justify-between items-baseline">
                    <p className="text-gray-600">{exp.company}</p>
                    <p className="text-sm text-gray-500">
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                    </p>
                  </div>
                </div>
                {exp.description && (
                  <p className="text-gray-700 mb-2">{exp.description}</p>
                )}
                {exp.achievements.length > 0 && (
                  <ul className="space-y-1 text-gray-700">
                    {exp.achievements.map((achievement, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-gray-400">—</span>
                        <span>{achievement}</span>
                      </li>
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
        <div className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">
            Education
          </h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <h3 className="font-semibold">{edu.degree}</h3>
                    <p className="text-gray-600">
                      {edu.institution} — {edu.field}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {edu.startDate} - {edu.endDate}
                  </p>
                </div>
                {edu.gpa && (
                  <p className="text-sm text-gray-600 mt-1">GPA: {edu.gpa}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">
            Skills
          </h2>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill, idx) => (
              <span key={idx} className="text-gray-700">
                {skill.name}
                {idx < skills.length - 1 && " •"}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MinimalTemplate;
