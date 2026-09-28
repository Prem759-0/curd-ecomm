import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api, readError } from '../api';
import { useAuth } from '../AuthContext';
import Field from '../components/Field';

export default function Auth({ mode }) {
  const isRegister = mode === 'register';
  const { login } = useAuth();
  const nav = useNavigate();
  const { state } = useLocation();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    setMessage('');
    try {
      if (isRegister) {
        await api.post('/auth/register', form);
        nav('/login', { state: { notice: 'Account created. Sign in to start selling.' } });
      } else {
        await login(form.email, form.password);
        nav('/shop');
      }
    } catch (err) {
      const r = readError(err);
      setErrors(r.fields);
      setMessage(r.message);
      setBusy(false);
    }
  }

  return (
    <section className="split">
      <div className="split-form">
        <form onSubmit={submit} noValidate>
          <h1>{isRegister ? 'Create your account' : 'Welcome back'}</h1>
          <p className="sub">{isRegister ? 'List your harvest and set your own prices.' : 'Sign in to manage your products.'}</p>

          {state?.notice && !message && <p className="notice">{state.notice}</p>}
          {message && !Object.keys(errors).length && <p className="notice bad" role="alert">{message}</p>}

          {isRegister && <Field id="name" label="Full name" autoComplete="name" value={form.name} onChange={set('name')} error={errors.name} />}
          <Field id="email" label="Email" type="email" autoComplete="email" value={form.email} onChange={set('email')} error={errors.email} />
          <Field
            id="password" label="Password" type="password"
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            value={form.password} onChange={set('password')} error={errors.password}
            hint={isRegister ? '8 or more characters with upper case, lower case and a number.' : undefined}
          />
          {isRegister && (
            <Field id="confirmPassword" label="Confirm password" type="password" autoComplete="new-password"
              value={form.confirmPassword} onChange={set('confirmPassword')} error={errors.confirmPassword} />
          )}

          <button className="btn block" disabled={busy}>{busy ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'}</button>
          <p className="switch">
            {isRegister ? <>Already selling here? <Link to="/login">Sign in</Link></> : <>New to GreenCart? <Link to="/register">Create an account</Link></>}
          </p>
        </form>
      </div>
      <aside className="split-side plum">
        <img src="/products/jamun.svg" alt="" />
        <p>Prices are set by the people who grew it.</p>
      </aside>
    </section>
  );
}
