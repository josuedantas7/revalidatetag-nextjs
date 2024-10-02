// app/LocationComponent.jsx

import { revalidateTag } from "next/cache";
import { ComponentForLocationA } from "./components/ComponentForLocationA";
import { ComponentForLocationB } from "./components/ComponentForLocationB";

async function LocationComponent() {
  const response = await fetch('http://localhost:3000/api/toggle-location', {
    cache: 'no-store',
    method: 'GET',
    next: {
      tags: ['location-data'], // Associa a tag
    },
  });

  const { location } = await response.json();

  // Verificação para garantir que a localização foi obtida
  if (!location) {
    return <div>Loading...</div>;
  }

  // Renderização condicional com base na localização
  return (
    <div>
      {location === 'locationA' ? (
        <ComponentForLocationA />
      ) : (
        <ComponentForLocationB />
      )}

      {/* Formulário para alternar a localização */}
      <form action={toggleLocation}>
        <label>
          <input type="radio" name="location" value="locationA" />
          Location A
        </label>
        <label>
          <input type="radio" name="location" value="locationB" />
          Location B
        </label>
        <button type="submit">Update Location</button>
      </form>
    </div>
  );
}

// Server Action embutida
async function toggleLocation(formData: FormData) {
  "use server";
  const selectedLocation = formData.get('location');

  console.log('!@# chamando função');

  const response = await fetch('http://localhost:3000/api/toggle-location', {
    method: 'POST',
    body: JSON.stringify({ location: selectedLocation }), // Enviando como JSON
    headers: {
      'Content-Type': 'application/json', // Cabeçalho correto
    },
  });

  revalidateTag('location-data'); // Invalidação da tag

  // Verificação da resposta
  if (!response.ok) {
    console.error('Failed to update location');
  }
}

export default LocationComponent;
