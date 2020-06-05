/** @jsx jsx */
import {jsx} from '@emotion/core'

import React from 'react'
import {
  FaCheckCircle,
  FaPlusCircle,
  FaMinusCircle,
  FaBook,
} from 'react-icons/fa'
import {FaTimesCircle} from 'react-icons/fa'
import Tooltip from '@reach/tooltip'
// 🐨 you'll need useQuery, useMutation, and the queryCache from 'react-query'
// 🐨 you'll need the client from the utils/api-client
import * as colors from 'styles/colors'
import {useAsync} from 'utils/hooks'
import {CircleButton, Spinner} from './lib'

function TooltipButton({user, label, highlight, onClick, icon, ...rest}) {
  const {isLoading, isError, error, run} = useAsync()

  function handleClick() {
    run(onClick())
  }

  return (
    <Tooltip label={isError ? error.message : label}>
      <CircleButton
        css={{
          backgroundColor: 'white',
          ':hover,:focus': {
            color: isLoading
              ? colors.gray80
              : isError
              ? colors.danger
              : highlight,
          },
        }}
        disabled={isLoading}
        onClick={handleClick}
        aria-label={isError ? error.message : label}
        {...rest}
      >
        {isLoading ? <Spinner /> : isError ? <FaTimesCircle /> : icon}
      </CircleButton>
    </Tooltip>
  )
}

function StatusButtons({user, book}) {
  // 🐨 we need the listItem for this book so call useQuery here
  // 💰 the queryKey should be 'list-items'
  // 💰 the queryFn should make a GET request to 'list-items' (with the user token)
  // 💰 client(`list-items`, {token: user.token}).then(data => data.listItems)
  // 🐨 if there are list items, find the one that has the same bookId as book.id
  const listItem = null

  // 🐨 we need to get an update function here, so call useMutation
  // 💰 this will basically be identical to the one you make in rating.js
  const update = () => {}

  // 🐨 let's get a remove function using useMutation
  // 💰 this one will make a DELETE request to the list-items/:listItemId endpoint
  const remove = () => {}

  // 🐨 let's get a create function using useMutation
  // 💰 this mutate function will accept an object with a bookId which you can
  // then use to make a POST request to the list-items endpoint with that as the data
  const create = () => {}

  return (
    <React.Fragment>
      {listItem ? (
        Boolean(listItem.finishDate) ? (
          <TooltipButton
            user={user}
            label="Unmark as read"
            highlight={colors.yellow}
            onClick={() => update({id: listItem.id, finishDate: null})}
            icon={<FaBook />}
          />
        ) : (
          <TooltipButton
            user={user}
            label="Mark as read"
            highlight={colors.green}
            onClick={() => update({id: listItem.id, finishDate: Date.now()})}
            icon={<FaCheckCircle />}
          />
        )
      ) : null}
      {listItem ? (
        <TooltipButton
          user={user}
          label="Remove from list"
          highlight={colors.danger}
          onClick={() => remove({id: listItem.id})}
          icon={<FaMinusCircle />}
        />
      ) : (
        <TooltipButton
          user={user}
          label="Add to list"
          highlight={colors.indigo}
          onClick={() => create({bookId: book.id})}
          icon={<FaPlusCircle />}
        />
      )}
    </React.Fragment>
  )
}

export {StatusButtons}
