export default function EmbedLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="p-4 bg-white">
        {children}
      </div>
    );
  }
  