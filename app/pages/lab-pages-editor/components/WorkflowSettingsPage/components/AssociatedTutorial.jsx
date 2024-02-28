export default function AssociatedTutorial() {

  function changeTutorial() {}

  const tutorials = [
    { id: '1111', display_name: 'Tutorial 1' },
    { id: '2222', display_name: 'Tutorial 2' }
  ];

  return (
    <ul className="input-group">
      {tutorials.map(tutorial => (
        <li>
          <input
            data-tutorial={tutorial.id}
            id={`associated-tutorial-${tutorial.id}`}
            onChange={changeTutorial}
            name="associated-tutorial"
            type="radio"
          />
          <label htmlFor={`associated-tutorial-${tutorial.id}`}>
            {tutorial.display_name || '???'} (#{tutorial.id})
          </label>
        </li>
      ))}
    </ul>
  );
}
