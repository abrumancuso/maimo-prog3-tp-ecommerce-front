"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";

function validateRequired(v) {
  if (!v) return "Requerido";
}

function validateEmail(v) {
  if (!v) return "Requerido";
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(v)) return "Email inválido";
}

export default function FormCheckout({ onSubmit }) {
  return (
    <Formik
      initialValues={{
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        zip: "",
      }}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await onSubmit(values);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-4">
          <h2 className="text-lg font-semibold">Datos del comprador</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-white/70">Nombre</label>
              <Field
                name="name"
                validate={validateRequired}
                className="mt-1 w-full rounded-lg bg-white/5 border border-white/20 px-3 py-2 outline-none"
                placeholder="Tu nombre"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-xs text-red-400 mt-1"
              />
            </div>

            <div>
              <label className="text-sm text-white/70">Email</label>
              <Field
                name="email"
                validate={validateEmail}
                type="email"
                className="mt-1 w-full rounded-lg bg-white/5 border border-white/20 px-3 py-2 outline-none"
                placeholder="tu@email.com"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-xs text-red-400 mt-1"
              />
            </div>

            <div>
              <label className="text-sm text-white/70">Teléfono</label>
              <Field
                name="phone"
                validate={validateRequired}
                className="mt-1 w-full rounded-lg bg-white/5 border border-white/20 px-3 py-2 outline-none"
                placeholder="11-1234-5678"
              />
              <ErrorMessage
                name="phone"
                component="div"
                className="text-xs text-red-400 mt-1"
              />
            </div>

            <div>
              <label className="text-sm text-white/70">Código Postal</label>
              <Field
                name="zip"
                validate={validateRequired}
                className="mt-1 w-full rounded-lg bg-white/5 border border-white/20 px-3 py-2 outline-none"
                placeholder="C1000"
              />
              <ErrorMessage
                name="zip"
                component="div"
                className="text-xs text-red-400 mt-1"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm text-white/70">Dirección</label>
              <Field
                name="address"
                validate={validateRequired}
                className="mt-1 w-full rounded-lg bg-white/5 border border-white/20 px-3 py-2 outline-none"
                placeholder="Calle 123, piso 1"
              />
              <ErrorMessage
                name="address"
                component="div"
                className="text-xs text-red-400 mt-1"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm text-white/70">Ciudad</label>
              <Field
                name="city"
                validate={validateRequired}
                className="mt-1 w-full rounded-lg bg-white/5 border border-white/20 px-3 py-2 outline-none"
                placeholder="CABA"
              />
              <ErrorMessage
                name="city"
                component="div"
                className="text-xs text-red-400 mt-1"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl px-5 py-3 bg-white text-black font-medium hover:opacity-90 disabled:opacity-60"
          >
            {isSubmitting ? "Procesando..." : "Confirmar compra"}
          </button>
        </Form>
      )}
    </Formik>
  );
}