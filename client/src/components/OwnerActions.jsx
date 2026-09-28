import { useState } from 'react';
import { Link } from 'react-router-dom';

// Edit link plus a two-step delete: the first click arms the button, the second one deletes.
export default function OwnerActions({ id, onDelete }) {
  const [armed, setArmed] = useState(false);
  return (
    <div className="owner">
      <Link to={`/products/${id}/edit`} className="btn ghost sm">Edit</Link>
      <button
        type="button"
        className={`btn ghost sm${armed ? ' danger' : ''}`}
        onClick={() => (armed ? onDelete(id) : setArmed(true))}
        onBlur={() => setArmed(false)}
      >
        {armed ? 'Yes, delete it' : 'Delete'}
      </button>
    </div>
  );
}
