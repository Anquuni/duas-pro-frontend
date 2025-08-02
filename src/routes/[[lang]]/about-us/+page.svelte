<script lang="ts">
  import * as Table from "$lib/components/ui/table/index.js";

  const features = [
    { feature: "Zeilen-für-Zeilen-Übersetzung", duasOrg: true, mustahab: false, duaplayer: true, siratGuide: true, duasPro: true },
    { feature: "Mehrsprachige Übersetzungen",   duasOrg: 1,    mustahab: 1,      duaplayer: 0,     siratGuide: 0,      duasPro: 10 },
    { feature: "Schriftgröße anpassbar",         duasOrg: false, mustahab: false, duaplayer: true,  siratGuide: false, duasPro: true },
    { feature: "Transliteration ein-/ausblenden",   duasOrg: false, mustahab: false, duaplayer: false, siratGuide: false, duasPro: true },
    { feature: "Audio zum Mitlesen",             duasOrg: false, mustahab: false, duaplayer: false, siratGuide: false, duasPro: true },
    { feature: "Live-Rezitation",               duasOrg: false, mustahab: false, duaplayer: false, siratGuide: false, duasPro: true },
    { feature: "Suche & Filter",                duasOrg: false, mustahab: false, duaplayer: false, siratGuide: false, duasPro: true },
    { feature: "Mobile-optimiert",              duasOrg: true,  mustahab: true,  duaplayer: false, siratGuide: true,  duasPro: true },
    { feature: "SEO-optimiert",                 duasOrg: false, mustahab: false, duaplayer: false, siratGuide: false, duasPro: true },
    { feature: "Open-Source",                   duasOrg: false, mustahab: false, duaplayer: false, siratGuide: false, duasPro: true },
    { feature: "Needs money?",        duasOrg: false, mustahab: false, duaplayer: true, siratGuide: true, duasPro: false },
    { feature: "100% Uptime",        duasOrg: true, mustahab: true, duaplayer: false, siratGuide: false, duasPro: true },
    { feature: "Website",        duasOrg: true, mustahab: true, duaplayer: true, siratGuide: false, duasPro: true },
    { feature: "App",        duasOrg: true, mustahab: false, duaplayer: false, siratGuide: true, duasPro: false },
    { feature: "Offline?",        duasOrg: false, mustahab: false, duaplayer: false, siratGuide: false, duasPro: false },
    { feature: "Dark / Light Mode",        duasOrg: false, mustahab: false, duaplayer: false, siratGuide: false, duasPro: false },
    { feature: "Rezitatoren Auswahl",        duasOrg: false, mustahab: false, duaplayer: false, siratGuide: false, duasPro: false },
    { feature: "Export",        duasOrg: false, mustahab: false, duaplayer: false, siratGuide: false, duasPro: false },
    { feature: "Lesezeichen",        duasOrg: false, mustahab: false, duaplayer: false, siratGuide: false, duasPro: false },
    { feature: "API Integration",        duasOrg: false, mustahab: false, duaplayer: false, siratGuide: false, duasPro: false },
    { feature: "Notification if Dua is recommended now",        duasOrg: false, mustahab: false, duaplayer: false, siratGuide: false, duasPro: false },
    { feature: "Number of Duas",        duasOrg: false, mustahab: false, duaplayer: false, siratGuide: false, duasPro: false }
  ];
</script>

<section class="mx-auto max-w-6xl px-4 py-8 sm:px-8 md:px-16 lg:px-24 xl:px-32 2xl:px-48">
  <h1 class="text-center text-4xl font-bold text-primary">Über uns</h1>
  <p class="my-4">
    Warum eine weitere Dua-Seite? Die bekannten Angebote fehlen oft an wichtigen Funktionen:<br />
    Zeilen-für-Zeilen-Übersetzungen, mehrsprachige Übersetzungen, anpassbare Schriftgröße, Transliteration, Audio, Live-Rezitation,
    Such- und Filterfunktionen sowie Open-Source-Ansatz.
  </p>

  <Table.Root>
    <Table.Caption class="text-left">Vergleich der wichtigsten Dua-Funktionen</Table.Caption>

    <Table.Header>
      <Table.Row>
        <Table.Head class="w-[250px]">Feature</Table.Head>
        <Table.Head class="bg-primary text-center text-white">duas.pro</Table.Head>
        <Table.Head class="text-center">duas.org</Table.Head>
        <Table.Head class="text-center">mustahab.de</Table.Head>
        <Table.Head class="text-center">duaplayer</Table.Head>
        <Table.Head class="text-center">Sirat Guide</Table.Head>
      </Table.Row>
    </Table.Header>

    <Table.Body>
      {#each features as row}
        <Table.Row>
          <Table.Cell class="font-semibold">{row.feature}</Table.Cell>

          <!-- duas.pro -->
          <Table.Cell class="bg-primary/10 text-center">
            {#if typeof row.duasPro === 'number'}
              {row.duasPro}
            {:else if row.duasPro}
              <span class="text-green-600">✓</span>
            {:else}
              <span class="text-red-600">✗</span>
            {/if}
          </Table.Cell>

          <!-- duas.org -->
          <Table.Cell class="text-center">
            {#if typeof row.duasOrg === 'number'}
              {row.duasOrg}
            {:else if row.duasOrg}
              <span class="text-green-600">✓</span>
            {:else}
              <span class="text-red-600">✗</span>
            {/if}
          </Table.Cell>

          <!-- mustahab.de -->
          <Table.Cell class="text-center">
            {#if typeof row.mustahab === 'number'}
              {row.mustahab}
            {:else if row.mustahab}
              <span class="text-green-600">✓</span>
            {:else}
              <span class="text-red-600">✗</span>
            {/if}
          </Table.Cell>

          <!-- duaplayer -->
          <Table.Cell class="text-center">
            {#if typeof row.duaplayer === 'number'}
              {row.duaplayer}
            {:else if row.duaplayer}
              <span class="text-green-600">✓</span>
            {:else}
              <span class="text-red-600">✗</span>
            {/if}
          </Table.Cell>

          <!-- Sirat Guide -->
          <Table.Cell class="text-center">
            {#if typeof row.siratGuide === 'number'}
              {row.siratGuide}
            {:else if row.siratGuide}
              <span class="text-green-600">✓</span>
            {:else}
              <span class="text-red-600">✗</span>
            {/if}
          </Table.Cell>

        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
</section>
