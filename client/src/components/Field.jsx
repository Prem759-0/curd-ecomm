// One labelled input with its error or hint. Pass as="textarea" or as="select" for those controls.
export default function Field({ id, label, as: Tag = 'input', error, hint, children, ...rest }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <Tag id={id} name={id} aria-invalid={!!error} aria-describedby={error ? `${id}-msg` : undefined} {...rest}>
        {children}
      </Tag>
      {error ? <p className="err" id={`${id}-msg`}>{error}</p> : hint ? <p className="hint">{hint}</p> : null}
    </div>
  );
}
