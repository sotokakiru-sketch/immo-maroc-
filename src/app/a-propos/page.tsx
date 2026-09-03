import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Target, Eye, Heart, Award, ArrowRight, Star } from "lucide-react";
import { AGENCY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Immo Maroc, votre agence immobilière de confiance à Tanger. Notre histoire, nos valeurs et notre engagement au cœur de la Médina.",
};

const VALUES = [
  {
    icon: Target,
    title: "Notre mission",
    text: "Rendre l'immobilier à Tanger accessible et serein grâce à une sélection rigoureuse et un accompagnement humain de bout en bout.",
  },
  {
    icon: Eye,
    title: "Notre vision",
    text: "Être la référence de l'immobilier à Tanger, en reliant les plus beaux biens de la Médina et de ses environs aux bonnes personnes.",
  },
  {
    icon: Heart,
    title: "Nos valeurs",
    text: "Exigence, transparence et écoute. Chaque transaction est une relation de confiance que nous cultivons dans la durée.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[60vh] items-center overflow-hidden bg-brand-950 pt-36">
        <Image
          src="https://images.pexels.com/photos/10205137/pexels-photo-10205137.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600"
          alt="Rue de Tanger"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="container-x relative text-center">
          <span className="eyebrow justify-center text-gold-400">
            <Star className="h-3.5 w-3.5 fill-gold-400" />
            Note Google {AGENCY.rating.toFixed(1)} · {AGENCY.reviewsCount} avis
          </span>
          <h1 className="mx-auto mt-4 max-w-3xl font-display text-4xl font-bold text-white sm:text-5xl">
            L&apos;immobilier de confiance, au cœur de Tanger
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sand-200">
            Immo Maroc, c&apos;est une équipe passionnée au service d&apos;une
            exigence : vous offrir les meilleures adresses de Tanger et de sa
            Médina.
          </p>
        </div>
      </section>

      {/* Histoire + stats */}
      <section className="py-20 lg:py-28">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="eyebrow">
              <span className="h-px w-8 bg-gold-500" />
              Notre histoire
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold text-brand-900 sm:text-4xl">
              Une agence ancrée dans la Médina de Tanger
            </h2>
            <div className="mt-5 space-y-4 leading-relaxed text-brand-700">
              <p>
                Immo Maroc est née au cœur de la Médina de Tanger, au 17/19 Rue
                Jnan Kaptan. De cette adresse chargée d&apos;histoire, nous
                accompagnons chaque jour acheteurs, vendeurs et locataires dans
                leurs projets immobiliers.
              </p>
              <p>
                Notre connaissance fine des quartiers — de la Médina à Malabata,
                California ou Marshan — nous permet de proposer des biens
                sélectionnés avec rigueur et de conseiller nos clients avec une
                réactivité saluée par les avis Google.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-6">
              {[
                { v: `${AGENCY.rating.toFixed(1)}★`, l: "Note Google" },
                { v: `${AGENCY.reviewsCount}`, l: "Avis vérifiés" },
                { v: "Médina", l: "Tanger & environs" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="font-display text-3xl font-bold text-brand-800">
                    {s.v}
                  </p>
                  <p className="text-xs uppercase tracking-wide text-brand-400">
                    {s.l}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-luxe">
            <Image
              src="https://images.pexels.com/photos/25254859/pexels-photo-25254859.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=720"
              alt="Architecture de la Médina"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="bg-brand-950 py-20 text-white lg:py-28">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow justify-center text-gold-400">
              <span className="h-px w-8 bg-gold-500" />
              Ce qui nous anime
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              Mission, vision &amp; valeurs
            </h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-8"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold-500 text-brand-950">
                  <v.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-sand-300">
                  {v.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container-x text-center">
          <Award className="mx-auto h-10 w-10 text-gold-500" />
          <h2 className="mt-4 font-display text-3xl font-bold text-brand-900 sm:text-4xl">
            Confiez-nous votre projet
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-600">
            Que vous achetiez, vendiez ou louiez à Tanger, notre équipe vous
            offre l&apos;excellence à chaque étape.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <Link href="/biens" className="btn btn-primary">
              Découvrir nos biens
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a href={`tel:${AGENCY.phoneTel}`} className="btn btn-gold">
              {AGENCY.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
