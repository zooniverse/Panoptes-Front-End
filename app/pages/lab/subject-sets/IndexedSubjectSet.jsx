import isAdmin from '../../../lib/is-admin';

export default function IndexedSubjectSet({ subjectSet }) {
  function updateMetadata(event) {
    const data = new FormData(event.target);
    const indexFields = data.get('indexFields');
    subjectSet.update({ 'metadata.indexFields': indexFields });
    subjectSet.save();
    event.preventDefault();
  }

  const readOnly = !isAdmin()
  return (
    <>
      <h4>Index settings</h4>
      <p>Subjects in this set are indexed and searchable.</p>
      <p><a href={`https://subject-set-search-api.zooniverse.org/subjects/${subjectSet.id}`}>View the index.</a></p>
      <form onSubmit={updateMetadata}>
        <label className="form-label" htmlFor="indexFields">Indexed metadata fields</label>
        <input
          id="indexFields"
          name="indexFields"
          className="standard-input full"
          type="text"
          disabled={readOnly}
          defaultValue={subjectSet.metadata.indexFields}
        />
        {!readOnly && <button className="standard-button" type="submit">Save</button>}
      </form>
    </>
  )
}
