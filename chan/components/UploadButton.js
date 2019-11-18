const UploadButton = props => {
  const handleInput = (event) => {
    document.querySelector("#plusIcon").setAttribute('fill', '#fff')
  }

  return (
    <div style={{
      position: "relative",
      overflow: "hidden",
      display: "inline-block",
      marginRight: 1,
      flex: 1
    }}>
      <input 
        type="file"
        name="image"
        id="image"
        accept="image/x-png,image/gif,image/jpeg"
        onInput={handleInput}
        style={{
          width: 0.1,
          height: 0.1,
          opacity: 0,
          overflow: "hidden",
          position: "absolute",
          zIndex: -1
        }}
      />
      <button
        id="uploadButton"
        type="button"
        style={{
          backgroundColor: "#1D1F21",
          border: 0,
          borderRadius: "4px 0px 0px 4px",
          minHeight: 36,
          height: "100%"
        }}
      >
        <label for="image">
          <svg 
            width={24}
            height={24}
            viewBox="0 0 512 512"
            style={{margin: 2, marginTop: 4}}
          >
            <path 
              id="plusIcon"
              fill="#757575"
              d={
                "M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm144 276c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92h-92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z"
              }
            />
          </svg>
        </label>
      </button>
    </div>
  )
}

export default UploadButton