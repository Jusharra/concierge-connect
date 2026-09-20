interface GoogleMapProps {
  /** "Map Embed URL" from the Locations table (Google Maps > Share > Embed a map > src). */
  embedUrl: string;
  title: string;
}

/** Lazy Google Map embed. Renders nothing unless the URL is a genuine Google Maps embed URL. */
const GoogleMap = ({ embedUrl, title }: GoogleMapProps) => {
  if (!/^https:\/\/www\.google\.com\/maps\/embed/.test(embedUrl)) return null;
  return (
    <div className="aspect-[16/9] w-full overflow-hidden rounded-lg border border-border/50">
      <iframe
        src={embedUrl}
        title={title}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="h-full w-full border-0"
      />
    </div>
  );
};

export default GoogleMap;
