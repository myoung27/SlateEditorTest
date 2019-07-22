import InsertImages from 'slate-drop-or-paste-images'
import PasteLinkify from 'slate-paste-linkify'
import { Editor, getEventTransfer } from 'slate-react'
import { Block, Value } from 'slate'


import React from 'react'
import initialValue from './value.json'
import { isKeyHotkey } from 'is-hotkey'
import { Button, Toolbar, Icon } from './EditorComponents'
import { FaAlignCenter,  FaAlignLeft, FaAlignJustify, FaCamera } from 'react-icons/fa'
import { FaBold } from 'react-icons/fa'
import { FaItalic } from 'react-icons/fa'
import { FaUnderline } from 'react-icons/fa'
import { FaCode } from 'react-icons/fa'
import { FaHeading } from 'react-icons/fa'
import { FaParagraph} from 'react-icons/fa'
import { FaQuoteRight } from 'react-icons/fa'
import { FaListOl } from 'react-icons/fa'
import { FaListUl } from 'react-icons/fa'
import { FaAlignRight } from 'react-icons/fa'


import imageExtensions from 'image-extensions'
import isUrl from 'is-url'
import { css } from 'emotion'
import { SlateEditor, SlateToolbar, SlateContent } from 'slate-editor'
import { ColorPlugin, ColorButton, ColorStateModel } from '@slate-editor/color-plugin'

const colorPluginOptions = new ColorStateModel().rgba({ r: 100, g: 100, b: 100, a: 1 }).gen()



/**
 * Define the default node type.
 *
 * @type {String}
 */

const DEFAULT_NODE = 'paragraph'

/**
 * Define hotkey matchers.
 *
 * @type {Function}
 */

const isBoldHotkey = isKeyHotkey('mod+b')
const isItalicHotkey = isKeyHotkey('mod+i')
const isUnderlinedHotkey = isKeyHotkey('mod+u')
const isCodeHotkey = isKeyHotkey('mod+`')

/**
 * The rich text example.
 *
 * @type {Component}
 */

const plugins = [
  PasteLinkify(),
  ColorPlugin(),
  InsertImages({
    extensions: ['png'],
    insertImage: (change, file) => {
      return change.insertBlock({
        type: 'image',
        isVoid: true,
        data: { file }
      })
    }
  })
]

/**
 * A function to determine whether a URL has an image extension.
 *
 * @param {String} url
 * @return {Boolean}
 */

function isImage(url) {
  return imageExtensions.includes(getExtension(url))
}

/**
 * Get the extension of the URL, using the URL API.
 *
 * @param {String} url
 * @return {String}
 */

function getExtension(url) {
  return new URL(url).pathname.split('.').pop()
}

/**
 * A change function to standardize inserting images.
 *
 * @param {Editor} editor
 * @param {String} src
 * @param {Range} target
 */

function insertImage(editor, src, target) {
  if (target) {
    editor.select(target)
  }

  editor.insertBlock({
    type: 'image',
    data: { src },
  })
}

class RichTextExample extends React.Component {
  /**
   * Deserialize the initial editor value.
   *
   * @type {Object}
   */

  state = {
    value: Value.fromJSON(initialValue),
  }

  /**
   * Check if the current selection has a mark with `type` in it.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasMark = type => {
    const { value } = this.state
    return value.activeMarks.some(mark => mark.type === type)
  }

  /**
   * Check if the any of the currently selected blocks are of `type`.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasBlock = type => {
    const { value } = this.state
    return value.blocks.some(node => node.type === type)
  }

  // /**
  //  * Store a reference to the `editor`.
  //  *
  //  * @param {Editor} editor
  //  */

  ref = editor => {
    this.editor = editor
  }

  // /**
  //  * Render.
  //  *
  //  * @return {Element}
  //  */

   

  render() {
    return (
      <div>
        <Toolbar>
        {this.renderMarkButton('bold', <FaBold/>)}
          {this.renderMarkButton('italic', <FaItalic/>)}
          {this.renderMarkButton('underlined', <FaUnderline/>)}
          {this.renderMarkButton('code', <FaCode/>)}
          {this.renderBlockButton('heading-one', <FaHeading/>)}
          {this.renderBlockButton('heading-two', <FaParagraph/>)}
          {this.renderBlockButton('block-quote', <FaQuoteRight/>)}
          {this.renderBlockButton('numbered-list', <FaListOl/>)}
          {this.renderBlockButton('bulleted-list', <FaListUl/>)}
          {this.renderBlockButton('alignLeft', <FaAlignLeft/> )} 
          {this.renderBlockButton('alignRight', <FaAlignRight/>)} 
          {this.renderBlockButton('alignCenter', <FaAlignCenter/>)} 
          {this.renderBlockButton('alignJustify', <FaAlignJustify/>)}
          <Button onMouseDown={this.onClickImage}>
            <FaCamera/>
          </Button>
        </Toolbar>
        <Editor
          spellCheck
          autoFocus
          plugins={plugins}
          placeholder="Enter some text..."
          ref={this.ref}
          value={this.state.value}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          onDrop={this.onDropOrPaste}
          onPaste={this.onDropOrPaste}
          renderBlock={this.renderBlock}
          renderMark={this.renderMark}
        />
      </div>
    )
  }

  // /**
  //  * Render a mark-toggling toolbar button.
  //  *
  //  * @param {String} type
  //  * @param {String} icon
  //  * @return {Element}
  //  */

  renderMarkButton = (type, icon) => {
    const isActive = this.hasMark(type)

    return (
      <Button
        active={isActive}
        onMouseDown={event => this.onClickMark(event, type)}
      >
        <Icon>{icon}</Icon>
      </Button>
    )
  }

  // /**
  //  * Render a block-toggling toolbar button.
  //  *
  //  * @param {String} type
  //  * @param {String} icon
  //  * @return {Element}
  //  */

  renderBlockButton = (type, icon) => {
    let isActive = this.hasBlock(type)

    if (['numbered-list', 'bulleted-list'].includes(type)) {
      const { value: { document, blocks } } = this.state

      if (blocks.size > 0) {
        const parent = document.getParent(blocks.first().key)
        isActive = this.hasBlock('list-item') && parent && parent.type === type
      }
    }

    return (
      <Button
        active={isActive}
        onMouseDown={event => this.onClickBlock(event, type)}
      >
        <Icon>{icon}</Icon>
      </Button>
    )
  }

  /**
  //  * Render a Slate block.
  //  *
  //  * @param {Object} props
  //  * @return {Element}
  //  */

  renderBlock = (props, editor, next) => {
    const { attributes, children, node, isFocused } = props

    switch (node.type) {
      case 'block-quote':
        return <blockquote {...attributes}>{children}</blockquote>
      case 'bulleted-list':
        return <ul {...attributes}>{children}</ul>
      case 'heading-one':
        return <h1 {...attributes}>{children}</h1>
      case 'heading-two':
        return <h2 {...attributes}>{children}</h2>
      case 'list-item':
        return <li {...attributes}>{children}</li>
      case 'numbered-list':
        return <ol {...attributes}>{children}</ol>
      case 'alignLeft':
        return <p style={{textAlign:"left"}}>{props.children}</p>
      case 'alignRight':
        return <p style={{textAlign:"right"}}>{props.children}</p>
      case 'alignCenter':
        return <p style={{textAlign:"center"}}>{props.children}</p>
      case 'alignJustify':
        return <p style={{textAlign:"justify"}}>{props.children}</p>
        case 'image': {
          const src = node.data.get('src')
          return (<img {...attributes} src={src}className={css`display: block;
                max-width: 100%;
                max-height: 20em;
                box-shadow: ${isFocused ? '0 0 0 2px blue;' : 'none'};
              `}
            />)
        }
      default:{
        return next()
    }
  }
}

  //   /**
  //  * On clicking the image button, prompt for an image and insert it.
  //  *
  //  * @param {Event} event
  //  */

 


  renderMark = (props, editor, next) => {
    const { children, mark, attributes } = props

    switch (mark.type) {
      case 'bold':
        return <strong {...attributes}>{children}</strong>
      case 'code':
        return <code {...attributes}>{children}</code>
      case 'italic':
        return <em {...attributes}>{children}</em>
      case 'underlined':
        return <u {...attributes}>{children}</u>
      default:{
        return next()
    }
  }
}

  /**
   * On change, save the new `value`.
   *
  //  * @param {Editor} editor
   */

  onChange = ({ value }) => {
    this.setState({ value })
  }

  /**
   * On key down, if it's a formatting command toggle a mark.
  //  *
  //  * @param {Event} event
  //  * @param {Editor} editor
  //  * @return {Change}
  //  */

  onKeyDown = (event, editor, next) => {
    let mark

    if (isBoldHotkey(event)) {
      mark = 'bold'
    } else if (isItalicHotkey(event)) {
      mark = 'italic'
    } else if (isUnderlinedHotkey(event)) {
      mark = 'underlined'
    } else if (isCodeHotkey(event)) {
      mark = 'code'
    } else {
      return next()
    }

    event.preventDefault()
    editor.toggleMark(mark)
  }

  /**
   * When a mark button is clicked, toggle the current mark.
   *
  //  * @param {Event} event
  //  * @param {String} type
  //  */

  onClickMark = (event, type) => {
    event.preventDefault()
    this.editor.toggleMark(type)
  }

  /**
   * When a block button is clicked, toggle the block type.
   *
   * @param {Event} event
   * @param {String} type
   */

  onClickBlock = (event, type) => {
    event.preventDefault()

    const { editor } = this
    const { value } = editor
    const { document } = value

    // Handle everything but list buttons.
    if (type !== 'bulleted-list' && type !== 'numbered-list') {
      const isActive = this.hasBlock(type)
      const isList = this.hasBlock('list-item')

      if (isList) {
        editor
          .setBlocks(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      } else {
        editor.setBlocks(isActive ? DEFAULT_NODE : type)
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = this.hasBlock('list-item')
      const isType = value.blocks.some(block => {
        return !!document.getClosest(block.key, parent => parent.type === type)
      })

      if (isList && isType) {
        editor
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      } else if (isList) {
        editor
          .unwrapBlock(
            type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
          )
          .wrapBlock(type)
      } else {
        editor.setBlocks('list-item').wrapBlock(type)
      }
    }
  }

  onClickImage = event => {
    event.preventDefault()
    const src = window.prompt('Enter the URL of the image:')
    if (!src) return
    this.editor.command(insertImage, src)
  }

  // /**
  //  * On drop, insert the image wherever it is dropped.
  //  *
  //  * @param {Event} event
  //  * @param {Editor} editor
  //  * @param {Function} next
  //  */

  onDropOrPaste = (event, editor, next) => {
    const target = editor.findEventRange(event)
    if (!target && event.type === 'drop') return next()

    const transfer = getEventTransfer(event)
    const { type, text, files } = transfer

    if (type === 'files') {
      for (const file of files) {
        const reader = new FileReader()
        const [mime] = file.type.split('/')
        if (mime !== 'image') continue

        reader.addEventListener('load', () => {
          editor.command(insertImage, reader.result, target)
        })

        reader.readAsDataURL(file)
      }
      return
    }

    if (type === 'text') {
      if (!isUrl(text)) return next()
      if (!isImage(text)) return next()
      editor.command(insertImage, text, target)
      return
    }

    next()
  }
}


 

export default RichTextExample
