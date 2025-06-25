export function WithLineBreaks({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, idx, lines) => (
        <span key={idx}>
          {line}
          {idx < lines.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}
