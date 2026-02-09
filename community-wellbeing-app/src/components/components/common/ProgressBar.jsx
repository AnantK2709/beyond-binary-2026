function ProgressBar({ progress, className = "" }) {
  return (
    <div className={\`progress-bar \${className}\`}>
      <div className="progress-fill" style={{ width: \`\${progress}%\` }}></div>
    </div>
  )
}
export default ProgressBar
