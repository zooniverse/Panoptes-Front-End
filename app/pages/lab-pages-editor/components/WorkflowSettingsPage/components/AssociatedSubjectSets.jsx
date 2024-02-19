export default function AssociatedSubjectSets({ workflow }) {
  if (!workflow) return null;

  const subjectSets = [
    { id: '1234', display_name: 'Test 1' },
    { id: '1235', display_name: 'Test 2' }
  ];

  return (
    <ul className="checkbox-group">
      {subjectSets.map((subjectSet, index) => (
        <li>
          <input id={`associated-subject-set-${subjectSet.id}`} type="checkbox" />
          <label htmlFor={`associated-subject-set-${subjectSet.id}`}>{subjectSet.display_name || '???'}</label>
        </li>
      ))}
    </ul>
  );
}
